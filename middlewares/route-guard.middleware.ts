// middlewares/route-guard.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
  tokenPayload?: string | object;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    req.tokenPayload = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
