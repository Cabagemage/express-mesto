const router = require('express').Router();
const path = require('path');
const getJson = require('../utils/getJson.js');

const customPath = path.join(__dirname, '..', 'data', 'users.json');

router.get('/users', (req, res) => {
  getJson(customPath).then((data) => res.send(data));
});

router.get('/users/:_id', (req, res) => {
  const { _id } = req.params;
  getJson(customPath)
    .then((data) => {
      const userToFind = data.find((user) => user._id === _id);
      return userToFind;
    })
    .then((user) => {
      if (!user) {
        return res.status(404)
          .send({ message: 'Такого пользователя не существует' });
      }
      res.send(user);
    }).then((data) => res.status(500).send(data));
});

module.exports = router;
