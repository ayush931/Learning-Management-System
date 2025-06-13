import { Router } from "express";
import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/user.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";
const userRouter = Router();

// using the multer middleware
userRouter.post("/register", upload.single("avatar"), register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);
// checking if the user is loggedin or not, using isLoggedIn middleware
userRouter.get("/me", isLoggedIn, getProfile);

export default userRouter;