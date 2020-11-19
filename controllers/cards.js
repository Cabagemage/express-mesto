// Перед пулл-реквестом нужно проверить работу методов по лайку и дизлайку

const cardSchema = require('../models/card');
const NotFound = require('../utils/Errors/NotFound');
const BadRequest = require('../utils/Errors/BadRequest');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((cards) => {
      res.send({ data: cards });
    }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new BadRequest('Карточка не может быть создана');
        next(validationError);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  cardSchema.findByIdAndDelete(req.params._cardId);
  const owner = req.user._id
    .orFail(() => {
      throw new NotFound('Карточка уже удалена');
    })
    .then((card) => {
      if (!owner) { res.status(400).send({ message: 'sorry' }); }
      res.status(200).send({ data: card });
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => cardSchema.findByIdAndUpdate(req.params._cardId,
  { $addToSet: { likes: req.user._id } }, { new: true })
  .orFail(() => {
    throw new NotFound('Карточка не найдена');
  })
  .then((likes) => { res.status(200).send({ data: likes }); })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => cardSchema.findByIdAndUpdate(
  req.params._cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
  .orFail(() => {
    throw new NotFound('Карточка не найдена');
  })
  .then((likes) => { res.status(200).send({ data: likes }); })
  .catch(next);
