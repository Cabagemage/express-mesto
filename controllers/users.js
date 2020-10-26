const User = require('../models/user');
const { ERROR_404, ERROR_400, ERROR_500 } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users) {
        res.send({ data: users });
      }
    })
    .catch((err) => res.status(err ? ERROR_400 : ERROR_500).send({ message: 'Список пользователей не найден' || 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => res.status(err ? ERROR_404 : ERROR_500).send({ message: 'Не может быть создан, так как гибискус' || 'Произошла ошибка' }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params._userId)
    .then((user) => {
      res.status(200).send({ data: user });
    }).catch((err) => res.status(err ? ERROR_404 : ERROR_500).send({ message: 'Пользователь не найден' || 'Произошла ошибка' }));
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._userId, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).then((user) => {
    res.status(200).send({ data: user });
  }).catch((err) => res.status(err ? ERROR_404 : ERROR_500).send({ message: 'Пользователь не найден' || 'Произошла ошибка' }));
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    // runValidators: true, // данные будут валидированы перед изменением
  }).then((user) => {
    res.status(200).send({ data: user.avatar });
  })
    .catch((err) => res.status(err ? ERROR_404 : ERROR_500).send({ message: 'Пользователь не найден' || 'Произошла ошибка' }));
};
