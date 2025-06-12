import { Router } from "express";
const userRouter = Router();

userRouter.post("/register", register),
userRouter.post("/login", login),
userRouter.get("/logout", logout),
userRouter.get("/me", getProfile);

export default userRouter