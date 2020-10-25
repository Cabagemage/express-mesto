const router = require('express').Router();

const {
  getUsers, createUser, findUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:id', findUser);
router.patch('/users/:id/me', changeUserInfo);
router.patch('/users/:id/avatar', changeUserAvatar);
router.post('/users', createUser);

module.exports = router;
