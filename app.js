const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const router = require('./routes/index.js');

const PORT = 3000;

const mongoDBUrl = 'mongodb://localhost:27017/mestodb';
const mongoDBOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(mongoDBUrl, mongoDBOptions);

app.use((req, res, next) => {
  req.user = {
    _id: '5f917b8e5d5d60127c164891', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, () => console.log('SERVER IS RUNNING'));
app.use('/', router);
