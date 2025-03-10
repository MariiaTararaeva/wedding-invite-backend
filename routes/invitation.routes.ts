import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { isAuthenticated } from "../middlewares/route-guard.middleware";

const router = Router();

// Type for the request body
interface InvitationRequestBody {
  template: string;
  names: string;
  weddingDate: string; // ISO format
  venue: string;
  rsvpLink?: string;
  isPaid?: boolean;
}

// Create an invitation
router.post("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const {
    template,
    names,
    weddingDate,
    venue,
    rsvpLink,
    isPaid = false,
  } = req.body as InvitationRequestBody;

  const userId = (req as any).tokenPayload.userId;

  try {
    const invitation = await prisma.invitation.create({
      data: {
        template,
        names,
        weddingDate: new Date(weddingDate),
        venue,
        rsvpLink,
        isPaid,
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(invitation);
  } catch (error) {
    next(error);
  }
});

// Get all invitations of the logged-in user
router.get("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).tokenPayload.userId;

  try {
    const invitations = await prisma.invitation.findMany({
      where: { userId },
    });
    res.json(invitations);
  } catch (error) {
    next(error);
  }
});

// Get a specific invitation by ID
router.get("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const invitationId = parseInt(req.params.id);
  const userId = (req as any).tokenPayload.userId;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation || invitation.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(invitation);
  } catch (error) {
    next(error);
  }
});

// Update an invitation
router.put("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const invitationId = parseInt(req.params.id);
  const userId = (req as any).tokenPayload.userId;
  const {
    template,
    names,
    weddingDate,
    venue,
    rsvpLink,
    isPaid,
  } = req.body as Partial<InvitationRequestBody>;

  try {
    const existing = await prisma.invitation.findUnique({ where: { id: invitationId } });

    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updated = await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        template: template ?? existing.template,
        names: names ?? existing.names,
        weddingDate: weddingDate ? new Date(weddingDate) : existing.weddingDate,
        venue: venue ?? existing.venue,
        rsvpLink: rsvpLink ?? existing.rsvpLink,
        isPaid: isPaid ?? existing.isPaid,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete an invitation (optional)
router.delete("/:id", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const invitationId = parseInt(req.params.id);
  const userId = (req as any).tokenPayload.userId;

  try {
    const existing = await prisma.invitation.findUnique({ where: { id: invitationId } });

    if (!existing || existing.userId !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.invitation.delete({ where: { id: invitationId } });

    res.json({ message: "Invitation deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
