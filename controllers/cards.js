// Перед пулл-реквестом нужно проверить работу методов по лайку и дизлайку

const cardSchema = require('../models/card');
const NotFound = require('../utils/Errors/NotFound');
// const BadRequest = require('../utils/Errors/BadRequest');

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
  const owner = req.user.id;
  cardSchema.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user.id;
  const { _cardId } = req.params;
  cardSchema.findById(_cardId)
    .orFail(() => {
      throw new NotFound('Карточка уже удалена');
    })
    .populate('owner')
    .then((card) => {
      if (card.owner.id === userId) {
        cardSchema.findByIdAndDelete(_cardId)
          .then((thisCard) => {
            res.status(200).send({ data: thisCard });
          });
      }
    })
    .catch(next);
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
