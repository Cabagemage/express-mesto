// Перед пулл-реквестом нужно проверить работу методов по лайку и дизлайку

const cardSchema = require('../models/card');
const NotFound = require('../utils/Errors/NotFound');
const BadRequest = require('../utils/Errors/BadRequest');
const ForbiddenError = require('../utils/Errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .orFail(() => {
      throw new NotFound({ message: 'Карточки не найдены' });
    })
    .then((cards) => {
      res.send({ data: cards });
    }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  cardSchema.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err && !name && !link) {
        const error = new BadRequest('С названием и ссылкой на изображение что-то не так');
        next(error);
      } else if (err && !name) {
        const error = new BadRequest('Введите название карточки');
        next(error);
      } else if (err && !link) {
        const error = new BadRequest('С ссылкой на изображение что-то не так');
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user.id;
  const { _cardId } = req.params;
  cardSchema.findById(_cardId)
    .populate('owner')
    .then((card) => {
      if (card.owner.id === userId) {
        cardSchema.findByIdAndDelete(_cardId)
          .then((thisCard) => {
            res.status(200).send(thisCard);
          });
      } else {
        const err = new ForbiddenError('Запрещено удалять карточки других пользователей');
        next(err);
      }
    })
    .catch((err) => {
      if (err) {
        const error = new NotFound('Карточка уже удалена');
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => cardSchema.findByIdAndUpdate(req.params._cardId,
  { $addToSet: { likes: req.user.id } }, { new: true })
  .orFail(() => {
    throw new NotFound({ message: 'Карточка не существует' });
  })
  .then((likes) => { res.status(200).send(likes); })
  .catch((err) => {
    if (err) {
      const error = new NotFound('Карточка не найдена');
      next(error);
    }
  });

module.exports.dislikeCard = (req, res, next) => cardSchema.findByIdAndUpdate(req.params._cardId,
  { $pull: { likes: req.user.id } }, { new: true })
  .orFail(() => {
    throw new NotFound({ message: 'Карточка не существует' });
  })
  .then((likes) => { res.status(200).send(likes); })
  .catch((err) => {
    if (err) {
      const error = new NotFound('Карточка не найдена');
      next(error);
    }
  });
