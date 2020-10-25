const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.get('/cards/:id', deleteCard);
router.get('/cards/:id/likes', likeCard);
router.get('/cards/:id/likes', dislikeCard);
router.post('/cards', createCard);

module.exports = router;
