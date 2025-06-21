import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import userRouter from './routes/user.route';
import errorMiddleware from './middlewares/error.middleware';
import courseRouter from './routes/course.route';
import paymentRouter from './routes/payment.route';
config();

const app = express();

// parse the data taking from the user in the json format
app.use(express.json());

// helps to parse the token in the cookies
app.use(cookieParser());

// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true }));

// show the api call in the terminal
app.use(morgan('dev'));

// connetion between the frontend and the backend for the resource sharing
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);

// all the routers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/payment', paymentRouter);

//@ts-ignore
// cheking the error middleware and stoping the execution when the js thread reaches here
app.use(errorMiddleware);

export default app;
