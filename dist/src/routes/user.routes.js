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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../../prisma/client"));
const router = (0, express_1.Router)();
// POST /api/invitations
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email, password, } = req.body;
    try {
        const user = yield client_1.default.user.create({
            data: {
                id,
                email,
                password,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
}));
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
exports.default = router;
