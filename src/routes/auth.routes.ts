import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  tokenPayload?: { userId: string; email: string };
}

// Signup
router.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, guestId } = req.body;

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

    // Link guest invitations if a guestId exists
    if (guestId) {
      await prisma.invitation.updateMany({
        where: { userId: null, guestId },
        data: { userId: newUser.id, guestId: null },
      });
    }

    // Generate a JWT token just like in login
    const payload = { userId: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    // Return the token + user to the frontend
    res.status(201).json({
      user: { id: newUser.id, email: newUser.email },
      token,
      message: "User created"
    });
  } catch (err) {
    next(err);
  }
});


// Login
router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, guestId } = req.body;

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

    if (guestId) {
      await prisma.invitation.updateMany({
        where: { userId: null, guestId },
        data: { userId: user.id, guestId: null },
      });
    } // Update invitations created as guest with the user ID when a guest logs in
    
    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email }
    })
    } catch (err) {
    next(err);
  }
});

// Verify
router.get("/verify", isAuthenticated, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise< void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req.tokenPayload?.userId) },
      select: { id: true, email: true },
    });

     res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
//