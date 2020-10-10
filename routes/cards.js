const router = require('express').Router();
const path = require('path');
const getJson = require('../utils/getJson.js');

const customPath = path.join(__dirname, '..', 'data', 'cards.json');

router.get('/cards', (req, res) => {
  getJson(customPath).then((data) => res.send(data));
});

module.exports = router;
