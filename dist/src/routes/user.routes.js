"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// // GET /api/user/{id}
// router.get("/:id", async (req: Request, res: Response, next: NextFunction):  Promise<void>=> {
//     const { id } = req.params;
//     console.log("User route hit for ID:", id);  // <-- Add this
//     try {
//       const user = await prisma.user.findUnique({
//         where: { id: Number(id) },
//       });
//       if (!user) {
//          res.status(404).json({ message: "User not found" });
//         return;
//       }
//       res.json(user);
//     } catch (error) {
//       next(error);
//     }
//   });
// GET all
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("All users route by ID", id);
    try {
        const user = yield prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}));
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
exports.default = router;
