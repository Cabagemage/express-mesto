require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const { login, createUser } = require('./controllers/users');
const { userValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const index = require('./routes/index');

const { PORT } = process.env;
const app = express();

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

app.use(cors());
app.post('/signin', login, userValidation);
app.post('/signup', createUser, userValidation);
app.use(auth);
app.use(index);

mongoose.connect(mongoDBUrl, mongoDBOptions);

app.use((err, req, res, next) => {
  const status = err.status || 500; res.status(status);
  const error = err.message;
  res.status(status).send(error);
  next();
});
app.listen(PORT, () => console.log('SERVER IS RUNNING'));
