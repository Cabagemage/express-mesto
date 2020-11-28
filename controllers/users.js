require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../utils/Errors/NotFound');
const BadRequest = require('../utils/Errors/BadRequest');
const ConflictError = require('../utils/Errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
  User.findById(req.user.id)
    .orFail(() => { throw new NotFound('Пользователь не найден'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err) { const error = new BadRequest('Что-то пошло не так'); next(error); }
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) { const error = new ConflictError('Такой пользователь уже существует'); next(error); } else if (password.length === 0 || !password.trim()) {
        const error = new BadRequest('Пароль состоит только из пробелов. Это плохо.'); next(error);
      }
    });
  bcrypt.hash(password, 10).then((hash) => User.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  }).then((user) => {
    res.status(200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  })).catch((err) => {
    if (err && !email) { const error = new BadRequest('Некорректно введена почта'); next(error); }
  });
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params._userId)
    .orFail(() => {
      throw new NotFound('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    }).catch((err) => {
      if (err && !req.params._userid) {
        const error = new NotFound('Пользователь не найден');
        next(error);
      }
    });
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      res.status(200).send(user);
    }).catch((err) => {
      if (err && name.length < 2) {
        const error = new BadRequest('Убедитесь, что длина поля name составляет больше двух символов');
        next(error);
      } else if (err && about.length < 2) {
        const error = new BadRequest('Убедитесь, что длина поля about составляет больше двух символов');
        next(error);
      }
    });
};

module.exports.changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err) {
        const error = new BadRequest('При обновлении аватара произошла ошибка. Убедитесь что передали корректную ссылку');
        next(error);
      }
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.send({ token });
    }).catch((err) => {
      next(err);
    });
};
