import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { isAuthenticated } from "../middleware/route-guard-middleware";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  tokenPayload?: { userId: number; email: string };
}

// Signup
router.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password required" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ message: "Email already in use" });
       return;
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ user: { id: newUser.id, email: newUser.email }, message: "User created" });
  } catch (err) {
    next(err);
  }
}); 

// Login
router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
     res.status(400).json({ message: "Email and password required" });
     return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
     res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json({ token: token + "my token" }); 
  } catch (err) {
    next(err);
  }
});

// Verify
router.get("/verify", isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise< void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.tokenPayload?.userId) },
      select: { id: true, email: true },
    });

     res.json({ user: user + "my user" });
  } catch (err) {
    next(err);
  }
});

export default router;
