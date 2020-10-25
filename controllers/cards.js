const cardSchema = require('../models/card');
const { ERROR_404, ERROR_400, ERROR_500 } = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.card._id })
    .then((card) => res.send({ data: card }))

};

module.exports.deleteCard = (req, res, next) => {
  cardSchema.findByIdAndDelete(req.params.id)
    .then((card) => {
      res.send({ data: card });
    })
};

module.exports.likeCard = (req, res) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.params.id } },
  { new: true },
);

module.exports.dislikeCard = (req, res) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.params.id } },
  { new: true },
);
