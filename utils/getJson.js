const fsPromises = require('fs').promises;

module.exports = (pathUrl) => fsPromises.readFile(pathUrl, { encoding: 'utf8' })
  .then((file) => JSON.parse(file)).catch((err) => err.status(500).send({ message: 'error has ocured' }));
