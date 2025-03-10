import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { isAuthenticated, AuthenticatedRequest } from "../middlewares/route-guard.middleware";

const router = Router();

// Inline typing for auth request body
interface AuthRequestBody {
  email: string;
  password: string;
}

// Test route
router.get("/", (_req: Request, res: Response) => {
  res.json("All good in auth :)");
});

// POST Signup
router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as AuthRequestBody;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already taken" });
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// POST Login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as AuthRequestBody;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "No user with this email" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.TOKEN_SECRET as string,
      {
        algorithm: "HS256",
        expiresIn: "6h",
      }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// GET Verify
router.get("/verify", isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const tokenPayload = req.tokenPayload;
      const user = await prisma.user.findUnique({
        where: { id: tokenPayload.userId },
        include: { invitations: true },
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      next(error);
    }
  });
  
export default router;
