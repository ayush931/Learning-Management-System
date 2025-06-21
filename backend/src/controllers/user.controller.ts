import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/error.util';
import User from '../models/user.model';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendMail from '../utils/sendMail.util';
import crypto from 'crypto';

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
      return next(new AppError('Please provide all the details', 400));
    }

    // checking if the user exists
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return next(new AppError('Already registered, Please login', 400));
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
          'https://media.istockphoto.com/id/1300638740/vector/line-increase-and-decrease-icons.jpg?s=612x612&w=0&k=20&c=b6sDIM8byIuiRwAhfarEyWlZBt9WI6sI0MDFc-JKGQw=',
      },
    });

    if (!user) {
      return next(new AppError('User creation failed', 400));
    }

    // uploading the profile photo in cloudinary
    if (req.file) {
      console.log(req.file);
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms',
          height: 250,
          width: 250,
          gravity: 'faces',
          crop: 'fill',
        });
        if (result) {
          if (user.avatar) {
            user.avatar.public_id = result.public_id;
            user.avatar.secure_id = result.secure_url;
          }
          // remove the file from the folder
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(new AppError(String(error), 400));
      }
    }
    // generating the token
    //@ts-ignore
    const token = await user.generateJwtToken();

    if (!token) {
      return next(new AppError('Token not generated', 400));
    }

    // setting the token in the cookie with the cookieOptions
    res.cookie('token', token, cookieOptions);

    // saving the user in the database
    await user.save();

    // making the password blank before returning it
    user.password = '';

    // final response
    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
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
      return next(new AppError('Please provide the email and password', 400));
    }

    // checking if the user exists or not, if exists taking password
    const user = await User.findOne({ email }).select('+password');

    //@ts-ignore
    // checking if the user exists or not
    if (!user) {
      return next(new AppError('User not found, Please register', 400));
    }

    //@ts-ignore
    // comparing the password of the user from the database
    const validatePassword = await user.comparePassword(password);

    if (!validatePassword) {
      return next(new AppError('Invalid credentials', 400));
    }

    //@ts-ignore
    // generating the token again after verifying the user
    const token = await user.generateJwtToken();
    res.cookie('token', token, cookieOptions);

    // removing the value of password before returning it
    user.password = '';

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const logout: RequestMethod = async (req, res, next) => {
  try {
    // removing the token from the cookies
    res.cookie('token', null, {
      maxAge: 0,
      secure: true,
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successfully',
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
      return next(new AppError('Provide userId', 400));
    }

    // getting the detail of the user
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError('User does not exists', 400));
    }

    return res.status(200).json({
      success: true,
      message: 'User details',
      user,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const forgotPassword: RequestMethod = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Provide Email', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('Email does not exists', 400));
    }

    //@ts-ignore
    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    // making the reset password url using the token
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
    console.log(resetPasswordUrl);
    // subject for the main
    const subject = 'Reset-Password';
    // sending the reset password url as the message
    const message = `${resetPasswordUrl}`;

    try {
      // sending the mail to the user with the token
      await sendMail(email, subject, message);

      res.status(200).json({
        success: true,
        message: `Reset password token has been send to ${email} successfully`,
      });
    } catch (error) {
      // removing the token in case it will fail
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      })
    }
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const resetPassword: RequestMethod = async (req, res, next) => {
  try {
    // should be same as url
    const { resetToken } = req.params;
    const { password } = req.body;

    // checking if the token is available or not
    if (resetToken === undefined || resetToken === null || resetToken === '') {
      return next(new AppError('Token is not available', 400));
    }

    if (!password) {
      return next(new AppError('Provide New Password', 400));
    }

    // generating the reset password token using the crypto
    const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // finding the user with the forgot password token
    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or expired, Please try again', 400));
    }

    // setting the new password to the user password
    user.password = password;
    // removing the forgot and expiry token after changing the password
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    // saved the user
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const changePassword: RequestMethod = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    // providing the old and new password
    if (!oldPassword || !newPassword) {
      return next(new AppError('Provide Old and New Password', 400));
    }

    // if the user is not logged in
    if (!id) {
      return next(new AppError('Provide user id', 400));
    }

    // checking if the user exists or not
    const user = await User.findById(id).select('+password');

    if (!user) {
      return next(new AppError('User does not exists', 400));
    }

    //@ts-ignore
    const isPasswordValid = await user.comparePassword(oldPassword);

    // checking if the old password is matching or not
    if (!isPasswordValid) {
      return next(new AppError('Old password is invalid', 400));
    }

    // updating the new password
    user.password = newPassword;

    await user.save();

    user.password = '';

    return res.status(200).json({
      success: true,
      message: 'Password changed',
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

const update: RequestMethod = async (req, res, next) => {
  try {
    // getting the user name from the body
    const { name } = req.body;
    // getting id from the token
    const { id } = req.user.id;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError('User does not exists', 400));
    }

    // taking and updating the name
    if (name) {
      user.name = name;
    }
    if (req.file) {
      if (user.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      }

      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms',
          width: 250,
          height: 250,
          gravity: 'faces',
          crop: 'fill',
        });

        if (result) {
          if (user.avatar) {
            user.avatar.public_id = result.public_id;
            user.avatar.secure_id = result.secure_url;
          }
          // remove the file from the folder
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(new AppError(String(error), 500));
      }
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

export {
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  update,
};
