const router = require('express').Router();
const path = require('path');
const getJson = require('../utils/getJson.js');

const customPath = path.join(__dirname, '..', 'data', 'cards.json');

router.get('/cards', (req, res) => {
  getJson(customPath).then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка чтения файла' }));
});

module.exports = router;
