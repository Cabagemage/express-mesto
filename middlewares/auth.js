const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/configs/config');

module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.log(err);
  }

  req.user = payload;
  next();
};
