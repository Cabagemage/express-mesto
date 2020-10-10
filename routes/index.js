const router = require('express').Router();
const cards = require('./cards.js');
const users = require('./users.js');

router.use('/', users);
router.use('/', cards);
router.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Страницы не существует' });
  next();
});

module.exports = router;
