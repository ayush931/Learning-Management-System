import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";
import userRouter from "./routes/user.route";
config();

const app = express();

// parse the data taking from the user in the json format
app.use(express.json());

// helps to parse the token in the cookies
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// show the api call in the terminal
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
  })
);

// all the routers
app.use("/api/v1/user", userRouter);

//@ts-ignore
app.use(errorMiddleware);

export default app;
