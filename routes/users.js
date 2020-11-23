const router = require('express').Router();

const {
  getUsers, findUser, changeUserInfo, changeUserAvatar, getOwnerInfo
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getOwnerInfo);
router.get('/users/:_userId', findUser);
router.patch('/users/me/', changeUserInfo);
router.patch('/users/me/avatar', changeUserAvatar);

module.exports = router;
