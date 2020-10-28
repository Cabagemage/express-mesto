const User = require('../models/user');

const error404 = new Error('Пользователь не найден');
error404.statusCode = 404;

const error400 = new Error('Переданы некорректные данные');
error400.statusCode = 400;

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw error404;
    })
    .then((users) => {
      if (users) {
        res.send({ data: users });
      }
    })
    .catch(() => res.status(error404.statusCode).send({ message: 'Список пользователей не может быть получен' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(error400.statusCode).send({ message: 'Пользователь не может быть создан' }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params._userId)
    .orFail(() => {
      throw error404;
    }).then((user) => {
      res.status(200).send({ data: user });
    }).catch(() => res.status(error404.statusCode).send({ message: 'Пользователь не найден' }));
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params._userId, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  }).orFail(() => {
    throw error400;
  })
    .then((user) => {
      res.status(200).send({ data: user });
    }).catch(() => res.status(error400.statusCode).send({ message: 'При обновлении данных пользователя возникла ошибка. Проверьте правильность набора.' }));
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw error400;
  })
    .then((user) => {
      res.status(200).send({ data: user.avatar });
    })
    .catch(() => res.status(error400.statusCode).send({ message: 'При обновлении аватара произошла ошибка. Убедитесь что передали корректную ссылку' }));
};
