const userRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getUsers,
  findUser,
  changeUserInfo,
  changeUserAvatar,
  getOwnerInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getOwnerInfo);

userRouter.get('/:_userId', celebrate({
  params: Joi.object().keys({
    _userId: Joi.string().hex().required().length(24),
  }),
}), findUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), changeUserInfo);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), changeUserAvatar);

module.exports = userRouter;
