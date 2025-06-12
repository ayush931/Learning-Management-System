import { NextFunction, Request, Response } from "express";
import AppError from "../utils/error.util";
import User from "../models/user.model";

type RequestMethod = (req: Request, res: Response, next: NextFunction) => any;

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
};

const register: RequestMethod = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Please provide all the details", 400));
    }

    // checking if the user exists
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return next(new AppError("Already registered, Please login", 400));
    }

    // creating new user
    const user = await User.create({
      name: name,
      email: email,
      password: password,
      role: role,
      avatar: {
        public_id: email,
        secure_id:
          "https://media.istockphoto.com/id/1300638740/vector/line-increase-and-decrease-icons.jpg?s=612x612&w=0&k=20&c=b6sDIM8byIuiRwAhfarEyWlZBt9WI6sI0MDFc-JKGQw=",
      },
    });

    if (!user) {
      return next(new AppError("User creation failed", 400));
    }

    // saving the user in the database
    await user.save();

    // making the password blank before returning it
    user.password = "";

    //@ts-ignore
    // generating the token
    const token = await user.generateJwtToken();

    // setting the token in the cookie with the cookieOptions
    res.cookie("token", token, cookieOptions);

    // final response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

export { register };
