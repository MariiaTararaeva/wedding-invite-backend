import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

interface TokenPayload {
  userId: number;
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Missing Authorization header" });
        return;
    }
  
    try {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.TOKEN_SECRET as string) as TokenPayload;
      req.userId = payload.userId; // Assign it directly
      next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }
      res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = req.userId;
    if (!userId) {
      const err = new Error("Unauthorized access");
      (err as any).statusCode = 401;
      throw err;
    }
  };
  