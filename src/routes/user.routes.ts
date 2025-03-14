import { Router, Request, Response, NextFunction } from "express";
import prisma from "../../prisma/client";   

const router = Router();
  
// POST /api/invitations
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { id, email, password, } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        id,
        email,
        password,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// // GET all
// router.get("/", async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.userId;

//   try {
//     const user = await prisma.user.findMany({ where: { userId } });
//     res.json(userId);
//   } catch (error) {
//     next(error);
//   }
// });

// // GET one
// router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.userId;
//   const id = parseInt(req.params.id);

//   try {
//     const invitation = await prisma.invitation.findUnique({ where: { id } });
//     if (!invitation || invitation.userId !== userId) {
//       return res.status(403).json({ message: "Access denied" });
//     }
//     res.json(invitation);
//   } catch (error) {
//     next(error);
//   }
// });

// // PUT update
// router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.userId;
//   const id = parseInt(req.params.id);
//   const { template, names, weddingDate, venue, rsvpLink, isPaid } = req.body;

//   try {
//     const existing = await prisma.invitation.findUnique({ where: { id } });
//     if (!existing || existing.userId !== userId) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const updated = await prisma.invitation.update({
//       where: { id },
//       data: {
//         template: template ?? existing.template,
//         names: names ?? existing.names,
//         weddingDate: weddingDate ? new Date(weddingDate) : existing.weddingDate,
//         venue: venue ?? existing.venue,
//         rsvpLink: rsvpLink ?? existing.rsvpLink,
//         isPaid: isPaid ?? existing.isPaid,
//       },
//     });
//     res.json(updated);
//   } catch (error) {
//     next(error);
//   }
// });

// // DELETE
// router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   const userId = req.userId;
//   const id = parseInt(req.params.id);

//   try {
//     const existing = await prisma.invitation.findUnique({ where: { id } });
//     if (!existing || existing.userId !== userId) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     await prisma.invitation.delete({ where: { id } });
//     res.json({ message: "Invitation deleted" });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
