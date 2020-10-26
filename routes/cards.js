const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.get('/cards/:_cardId', deleteCard);
router.get('/cards/:_cardId/likes', likeCard);
router.get('/cards/:_cardId/likes', dislikeCard);
router.post('/cards', createCard);

module.exports = router;
