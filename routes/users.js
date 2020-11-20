const router = require('express').Router();

const {
  getUsers, findUser, changeUserInfo, changeUserAvatar, getOwnerInfo
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:_userId/me', getOwnerInfo);
router.get('/users/:_userId', findUser);
router.patch('/users/:_userId/me', changeUserInfo);
router.patch('/users/:_userId/avatar', changeUserAvatar);

module.exports = router;
