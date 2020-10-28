const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:_cardId', deleteCard);
router.put('/cards/:_cardId/likes', likeCard);
router.delete('/cards/:_cardId/likes', dislikeCard);
router.post('/cards', createCard);

module.exports = router;
