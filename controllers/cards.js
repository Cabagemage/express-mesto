const cardSchema = require('../models/card');
const { ERROR_404, ERROR_500 } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .then((cards) => {
      res.send({ data: cards });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.params._userId })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(err ? ERROR_404 : ERROR_500).send({ message: 'Карточка не найдена' || 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  cardSchema.findByIdAndDelete(req.params._cardId)
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => res.status(err ? ERROR_404 : ERROR_500).send({ message: 'Карточка уже удалена' || 'Произошла ошибка' }));
};

module.exports.likeCard = (req) => cardSchema.findByIdAndUpdate(req.params.cardId,
  { $addToSet: { likes: req.params._cardId } },
  { new: true });

module.exports.dislikeCard = (req) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.params._cardId } },
  { new: true }
);
