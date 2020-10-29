const cardSchema = require('../models/card');

const error404 = new Error('Карточка не найдена');
error404.statusCode = 404;

const error400 = new Error('Переданы некорректные данные');
error400.statusCode = 400;

module.exports.getCards = (req, res) => {
  cardSchema.find({})
    .orFail(() => {
      throw error404;
    })
    .then((cards) => {
      res.send({ data: cards });
    }).catch(() => res.status(error404.statusCode).send({ message: 'Карточка не найдена' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch(() => res.status(error400.statusCode).send({ message: 'Карточка не может быть создана' }));
};

module.exports.deleteCard = (req, res) => {
  cardSchema.findByIdAndDelete(req.params._cardId)
    .orFail(() => {
      throw error404;
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch(() => res.status(error404.statusCode).send({ message: 'Карточка не найдена' }));
};

module.exports.likeCard = (req, res) => cardSchema.findByIdAndUpdate(req.params._cardId,
  { $addToSet: { likes: req.user._id } }, { new: true })
  .orFail(() => {
    throw error404;
  })
  .then((likes) => { res.status(200).send({ data: likes }); })
  .catch(() => res.status(error404.statusCode).send({ message: 'Карточка не найдена' }));

module.exports.dislikeCard = (req, res) => cardSchema.findByIdAndUpdate(
  req.params._cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
  .orFail(() => {
    throw error404;
  })
  .then((likes) => { res.status(200).send({ data: likes }); })
  .catch(() => res.status(error404.statusCode).send({ message: 'Карточка не найдена' }));
