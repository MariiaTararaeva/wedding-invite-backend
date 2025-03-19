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
const route_guard_middleware_1 = require("../middleware/route-guard-middleware");
const router = (0, express_1.Router)();
// POST /api/invitations (open to guest or authenticated users)
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { template, names, weddingDate, venue, rsvpLink, isPaid = false, guestId } = req.body;
    const userId = (_a = req.userId) !== null && _a !== void 0 ? _a : null;
    try {
        const invitation = yield client_1.default.invitation.create({
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
    }
    catch (error) {
        next(error);
    }
}));
// GET all
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = 123;
    try {
        const invitations = yield client_1.default.invitation.findMany({ where: { userId } });
        res.json(invitations);
    }
    catch (error) {
        next(error);
    }
}));
// GET one invitation by ID (and verify ownership)
router.get("/:id", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // comes from the middleware
    const id = parseInt(req.params.id);
    try {
        const invitation = yield client_1.default.invitation.findUnique({
            where: { id },
        });
        if (!invitation || invitation.userId !== userId) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        res.json(invitation);
    }
    catch (error) {
        next(error);
    }
}));
// PUT /api/invitations/:id
router.put("/:id", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const { template, names, weddingDate, venue, rsvpLink, isPaid } = req.body;
    try {
        // 1. Check ownership
        const existing = yield client_1.default.invitation.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        // 2. Update the fields (only update what is provided)
        const updated = yield client_1.default.invitation.update({
            where: { id },
            data: {
                template: template !== null && template !== void 0 ? template : existing.template,
                names: names !== null && names !== void 0 ? names : existing.names,
                weddingDate: weddingDate ? new Date(weddingDate) : existing.weddingDate,
                venue: venue !== null && venue !== void 0 ? venue : existing.venue,
                rsvpLink: rsvpLink !== null && rsvpLink !== void 0 ? rsvpLink : existing.rsvpLink,
                isPaid: typeof isPaid === "boolean" ? isPaid : existing.isPaid,
            },
        });
        res.json({ message: "Invitation updated successfully", updated });
    }
    catch (error) {
        next(error);
    }
}));
// DELETE /api/invitations/:id
router.delete("/:id", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Comes from JWT token
    const id = parseInt(req.params.id); // Invitation ID to delete
    try {
        // 1. Check if the invitation exists and belongs to the user
        const existing = yield client_1.default.invitation.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        // 2. Delete and return the deleted invitation
        const deleted = yield client_1.default.invitation.delete({ where: { id } });
        res.json({ message: "Invitation deleted successfully", deleted });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
