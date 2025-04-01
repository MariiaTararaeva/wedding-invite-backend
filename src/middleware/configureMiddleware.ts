import express, { Express } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const FRONTEND_URL: string = process.env.ORIGIN || "http://localhost:5173";

const configureMiddleware = (app: Express): void => {
  app.set("trust proxy", 1);
  app.use(cors({ origin: FRONTEND_URL, credentials: true }));
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

export default configureMiddleware;
