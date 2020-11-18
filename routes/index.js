const express = require('express');

const app = express();

const router = require('express').Router();
const cards = require('./cards.js');
const users = require('./users.js');
const { requestLogger, errorLogger } = require('../middlewares/logger');

app.use(requestLogger);
router.use('/', users);
router.use('/', cards);

router.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Страницы не существует' });
  next();
});
app.use(errorLogger);

module.exports = router;
