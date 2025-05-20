import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import authRoute from "./routes/auths/auth";
const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api-v2/auth", authRoute);
app.use("/", (req, res, next) => {
  res.send("hello world");
});

app.use((req, res, next) => {
  next(createHttpError(404, "cette route n'existe pas"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "an unkwon error occured";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
