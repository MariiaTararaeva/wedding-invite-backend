import { Router, Request, Response, NextFunction } from "express";
import { User } from "@prisma/client"; // import the User type from Prisma for UpdateData
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = Router();
const prisma = new PrismaClient();

// GET all users
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany(); // fetch all users
    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
});

import { isAuthenticated } from "../middleware/route-guard-middleware";

// GET one user by ID with invitations [protected with isAuthenticated]
router.get("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const requesterId = req.userId;

  if (Number(id) !== requesterId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        invitations: true}, // include the user's invitations in the response for my profile page
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id
router.put("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  const id = parseInt(req.params.id);
  const { email, password } = req.body;

  if (userId !== id) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Prepare update object
    // const updateData: any = {};
    const updateData: Partial<User> = {};


    if (email && email !== existing.email) {
      updateData.email = email;
    }

    if (password) {
      const salt = bcrypt.genSaltSync(12);
      const hashedPassword = bcrypt.hashSync(password, salt);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No changes provided" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...safeUser } = updatedUser;
    res.json({ message: "User updated successfully", user: safeUser });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id
router.delete("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  const id = parseInt(req.params.id);

  if (userId !== id) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    
    if (!existing || existing.deletedAt !== null) {
      res.status(404).json({ message: "User not found or already deleted" });
      return;
    }

    const deletedUser = await prisma.user.delete({ where: { id } });
// Define a type for the new user object with password removed - Give me everything in the User type except the password field.
    const { password, ...safeUser } = deletedUser;

    
    res.json({ message: "User deleted successfully", deleted: safeUser });
  } catch (error) {
    next(error);
  }
});

// Soft-delete user
router.delete("/:id/deactivate", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  const id = parseInt(req.params.id);

  if (userId !== id) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing || existing.deletedAt !== null) {
      res.status(404).json({ message: "User not found or already deleted" });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.json({ message: "User soft-deleted successfully", deletedUserId: updated.id });
  } catch (error) {
    next(error);
  }
});

export default router;
