import express, { Express } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

const FRONTEND_URL: string = process.env.ORIGIN || "http://localhost:5173";

// Middleware configuration
const configureMiddleware = (app: Express): void => {
  // Trust proxy (important for deployments behind proxies like Heroku, Railway, etc.)
  app.set("trust proxy", 1);

  // Enable CORS
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );

  // Logging middleware (only used in development by default)
  app.use(logger("dev"));

  // Parsing incoming request bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Cookie parser
  app.use(cookieParser());
};

export default configureMiddleware;
