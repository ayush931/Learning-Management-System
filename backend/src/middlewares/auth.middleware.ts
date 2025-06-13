import { NextFunction, Request, Response } from "express";
import AppError from "../utils/error.util";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

type RequestMethod = (req: Request, res: Response, next: NextFunction) => any;

const isLoggedIn: RequestMethod = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthorized access, please login", 400));
  }

  // verify the user and their details
  const userDetails = await jwt.verify(token, process.env.JWT_SECRET as string);

  // setting the user details in the req.user after getting the details
  req.user = userDetails;

  next();
};

export {
  isLoggedIn
}