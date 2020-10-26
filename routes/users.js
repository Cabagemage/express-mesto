const router = require('express').Router();

const {
  getUsers, createUser, findUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:_userId', findUser);
router.patch('/users/:_userId/me', changeUserInfo);
router.patch('/users/:_userId/avatar', changeUserAvatar);
router.post('/users', createUser);

module.exports = router;
