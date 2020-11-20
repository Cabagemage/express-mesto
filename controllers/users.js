const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../utils/Errors/NotFound');
const BadRequest = require('../utils/Errors/BadRequest');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFound('Список пользователей не может быть получен');
    })
    .then((users) => {
      if (users) {
        res.send({ data: users });
      }
    })
    .catch(next);
};
module.exports.getOwnerInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById({
    _id
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new BadRequest('Пользователь не найден');
        next(validationError);
      }
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => User.create({
    email: req.body.email,
    password: hash
  }).then((user) => {
    res.send({ id: user._id, email: user.email });
  })).catch(() => {
    throw new BadRequest('Что-то не так с запросом');
  });
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params._userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    }).then((user) => {
      res.status(200).send({ data: user });
    }).catch(next);
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._userId, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(() => {
    throw new BadRequest('При обновлении данных пользователя возникла ошибка. Проверьте правильность набора.');
  })
    .then((user) => {
      res.status(200).send({ data: user });
    }).catch(next);
};

module.exports.changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new BadRequest('При обновлении аватара произошла ошибка. Убедитесь что передали корректную ссылку');
  })
    .then((user) => {
      res.status(200).send({ data: user.avatar });
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    }).catch(() => {
      throw new BadRequest('Что-то не так с авторизацией');
    })
    .catch(next);
};
