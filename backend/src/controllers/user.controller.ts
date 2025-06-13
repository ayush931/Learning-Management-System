import { NextFunction, Request, Response } from "express";
import AppError from "../utils/error.util";
import User from "../models/user.model";
import cloudinary from "cloudinary";
import fs from "fs";

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

    // uploading the profile photo in cloudinary
    if (req.file) {
      console.log(req.file);
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          height: 250,
          width: 250,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          if (user.avatar) {
            user.avatar.public_id = result.public_id;
            user.avatar.secure_id = result.secure_url;
          }
          // remove the file from the folder
          fs.unlink(`uploads/${req.file.filename}`, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
      } catch (error) {
        return next(new AppError(String(error), 400));
      }
    }
    // generating the token
    //@ts-ignore
    const token = await user.generateJwtToken();

    if (!token) {
      return next(new AppError("Token not generated", 400));
    }

    // setting the token in the cookie with the cookieOptions
    res.cookie("token", token, cookieOptions);

    // saving the user in the database
    await user.save();

    // making the password blank before returning it
    user.password = "";

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

const login: RequestMethod = async (req, res, next) => {
  try {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new AppError("Please provide the email and password", 400));
    }
  
    // checking if the user exists or not, if exists taking password
    const user = await User.findOne({ email }).select("+password");
  
    //@ts-ignore
    // comparing the password of the user from the database
    if (!user || !user.comparePassword(password)) {
      return next(new AppError("Username or Password is incorrect", 400));
    }
  
    //@ts-ignore
    // generating the token again after verifying the user
    const token = await user.generateJwtToken();
    res.cookie("token", token, cookieOptions);
    
    // removing the value of password before returning it
    user.password = "";
  
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const logout: RequestMethod = async (req, res, next) => {
  try {
    // removing the token from the cookies
    res.cookie("token", null, {
      maxAge: 0,
      secure: true,
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const getProfile: RequestMethod = async (req, res, next) => {
  try {
    // getting user id from the middleware
    const userId = req.user.id;

    if (!userId) {
      return next(new AppError("Provide userId", 400));
    }

    // getting the detail of the user
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User does not exists", 400));
    }

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

export { register, login, logout, getProfile };
