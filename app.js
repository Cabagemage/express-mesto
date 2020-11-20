const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const InternalError = require('./utils/Errors/InternalError');
const { login, createUser } = require('./controllers/users');
const { userValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');

const app = express();

const PORT = 3000;
const mongoDBUrl = 'mongodb://localhost:27017/mestodb';
const mongoDBOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', login, userValidation);
app.post('/signup', createUser, userValidation);
app.use(auth);
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

mongoose.connect(mongoDBUrl, mongoDBOptions);

app.use((err, req, res, next) => {
  const internalError = new InternalError('Хьюстон, у нас проблемы');
  const statusCode = err.statusCode || internalError;
  const error = err.message;
  res.status(statusCode).send(error);
  next();
});
app.listen(PORT, () => console.log('SERVER IS RUNNING'));
