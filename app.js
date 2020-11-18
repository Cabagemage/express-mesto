const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const InternalError = require('./utils/Errors/InternalError');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

const PORT = 3000;
const mongoDBUrl = 'mongodb://localhost:27017/mestodb';
const mongoDBOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

app.use((req, res, next) => {
  req.user = {
    _id: '5f917b8e5d5d60127c164891', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', require('./routes/index'));
app.use('/users', require('./routes/index'));

mongoose.connect(mongoDBUrl, mongoDBOptions);
app.use((err, req, res, next) => {
  const internalError = new InternalError('Хьюстон, у нас проблемы');
  const statusCode = err.statusCode || internalError;
  const error = err.message;
  res.status(statusCode).send(error);
  next();
});
app.listen(PORT, () => console.log('SERVER IS RUNNING'));
