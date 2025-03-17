import { Router, Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { isAuthenticated } from "../middleware/route-guard-middleware";


const router = Router();

// POST /api/invitations (open to guest or authenticated users)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { template, names, weddingDate, venue, rsvpLink, isPaid = false, guestId } = req.body;
  const userId = req.userId ?? null;

  try {
    const invitation = await prisma.invitation.create({
      data: {
        template,
        names,
        weddingDate: new Date(weddingDate),
        venue,
        rsvpLink,
        isPaid,
        userId,
        guestId: userId ? null : guestId, // Save guestId if user is not logged in
      },
    });

    res.status(201).json(invitation);
  } catch (error) {
    next(error);
  }
});


// GET all
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const userId = 123;

  try {
    const invitations = await prisma.invitation.findMany({ where: { userId } });
    res.json(invitations);
  } catch (error) {
    next(error);
  }
});

// GET one invitation by ID (and verify ownership)
router.get("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId; // comes from the middleware
  const id = parseInt(req.params.id);

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.json(invitation);
  } catch (error) {
    next(error);
  }
});

// PUT /api/invitations/:id
router.put("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  const id = parseInt(req.params.id);
  const { template, names, weddingDate, venue, rsvpLink, isPaid } = req.body;

  try {
    // 1. Check ownership
    const existing = await prisma.invitation.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // 2. Update the fields (only update what is provided)
    const updated = await prisma.invitation.update({
      where: { id },
      data: {
        template: template ?? existing.template,
        names: names ?? existing.names,
        weddingDate: weddingDate ? new Date(weddingDate) : existing.weddingDate,
        venue: venue ?? existing.venue,
        rsvpLink: rsvpLink ?? existing.rsvpLink,
        isPaid: typeof isPaid === "boolean" ? isPaid : existing.isPaid,
      },
    });

    res.json({ message: "Invitation updated successfully", updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/invitations/:id
router.delete("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId; // Comes from JWT token
  const id = parseInt(req.params.id); // Invitation ID to delete

  try {
    // 1. Check if the invitation exists and belongs to the user
    const existing = await prisma.invitation.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    // 2. Delete and return the deleted invitation
    const deleted = await prisma.invitation.delete({ where: { id } });

    res.json({ message: "Invitation deleted successfully", deleted });
  } catch (error) {
    next(error);
  }
});

export default router;
