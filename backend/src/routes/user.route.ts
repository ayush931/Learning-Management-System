import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  update,
} from '../controllers/user.controller';
import { isLoggedIn } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';
const userRouter = Router();

// using the multer middleware
userRouter.post('/register', upload.single('avatar'), register);
userRouter.post('/login', login);
userRouter.get('/logout', isLoggedIn, logout);
// checking if the user is loggedin or not, using isLoggedIn middleware
userRouter.get('/me', isLoggedIn, getProfile);
userRouter.post('/forgotPassword', forgotPassword);
// should be same as taking the url
userRouter.post('/resetPassword/:resetToken', resetPassword);
userRouter.post('/changePassword', isLoggedIn, changePassword);
userRouter.put('/update', isLoggedIn, upload.single('avatar'), update);

export default userRouter;
