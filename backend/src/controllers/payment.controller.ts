import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/error.util';
import User from '../models/user.model';
import razorpay from '..';
import crypto from 'crypto';
import Payment from '../models/payment.model';

type RequestMethod = (req: Request, res: Response, next: NextFunction) => any;

// getting the razorpay api key
export const getRazorpayApiKey: RequestMethod = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Razorpay API key',
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// purchasing course controller

export const buySubscription: RequestMethod = async (req, res, next) => {
  // taking the user id from the request
  const { id } = req.user;

  if (!id) {
    return next(new AppError('Provide user id to make payment', 400));
  }

  // check that user exists or not
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('User unauthorized access to make the payment', 400));
  }

  // creating a new subscription model in the database which the user has purchased
  const subscription = await razorpay.subscriptions.create({
    //@ts-ignore
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
  });

  //@ts-ignore
  // adding the id in the subscription id
  user.subscription.id = subscription.id;
  //@ts-ignore
  // adding the subscription status in the db
  user.subscription.status = subscription.status;

  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Subscribed successfully',
    //@ts-ignore
    subscription_id: subscription.id,
  });
};

// verifying the subscription of the user, matching their purchase

export const verifySubscription: RequestMethod = async (req, res, next) => {
  try {
    // taking the user id from the request
    const { id } = req.user;
    // now taking the payment id, signature from the frontend and the subscription id from the db to verify after making the purchase
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

    if (!id) {
      return next(new AppError('Provide user id to verify payment', 400));
    }

    if (!razorpay_payment_id || !razorpay_signature || !razorpay_subscription_id) {
      return next(new AppError('Provide all the details to verify payment', 400));
    }

    // finding the user from the database
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError('User does not exists', 400));
    }

    //@ts-ignore
    // adding the id of the subscription in the database
    const subscriptionId = user.subscription?.id;

    if (!subscriptionId) {
      return next(new AppError('Subscription id is not available', 400));
    }

    // Generating a signature with SHA256 for verification purposes
    // Here the subscriptionId should be the one which we saved in the DB
    // razorpay_payment_id is from the frontend and there should be a '|' character between this and subscriptionId
    // At the end convert it to Hex value
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || '')
      .update(`${razorpay_payment_id} | ${subscriptionId}`)
      .digest('hex');

    // matching the generated signature and the signature from the frontend is same or not
    if (generatedSignature !== razorpay_signature) {
      return next(new AppError('Payment not verified, Please try again', 400));
    }

    // saving the details in the Payment model
    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    //@ts-ignore
    // making the subscription active after the verification
    user.subscription.status = 'active';
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

// to cancel the subscription of the user
export const cancelSubscription: RequestMethod = async (req, res, next) => {
  try {
    // taking the user id from the request
    const { id } = req.user;

    if (!id) {
      return next(new AppError('Provide user id to cancel subscription', 400));
    }

    // finding that user exists or not
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError('User does not exists', 400));
    }

    // if the role is admin, they are not allowed to cancel the subscription
    if (user.role === 'ADMIN') {
      return next(new AppError('Admin cannot purchase a subscription', 400));
    }

    //@ts-ignore
    //taking the subscription id from the database
    const subscriptionId = user.subscription?.id;

    if (!subscriptionId) {
      return next(new AppError('Subscription id is not available', 400));
    }

    // cancelling the subscription
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    if (!subscription) {
      return next(new AppError('Unable to cancel subscription', 400));
    }

    //@ts-ignore
    // updating the status in the database
    user.subscription.status = subscription.status;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription cancelled',
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};

export const allPayments: RequestMethod = async (req, res, next) => {
  try {
    // taking the total number of count to get the payment detail
    const count = Number(req.params.count);

    // getting the number of payment (count) through the params
    const subscription = razorpay.subscriptions.all({
      count: count || 10,
    });

    return res.status(200).json({
      success: true,
      message: 'All payments',
      subscription,
    });
  } catch (error) {
    return next(new AppError(String(error), 500));
  }
};
