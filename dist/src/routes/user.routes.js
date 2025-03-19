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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// GET all users
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany(); // fetch all users
        if (!users || users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}));
const route_guard_middleware_1 = require("../middleware/route-guard-middleware");
// GET one user by ID with invitations [protected with isAuthenticated]
router.get("/:id", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const requesterId = req.userId;
    if (Number(id) !== requesterId) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: Number(id) },
            include: {
                invitations: true
            }, // include the user's invitations in the response for my profile page
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}));
// PUT /api/users/:id
router.put("/:id", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    const { email, password } = req.body;
    if (userId !== id) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    try {
        const existing = yield prisma.user.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Prepare update object
        // const updateData: any = {};
        const updateData = {};
        if (email && email !== existing.email) {
            updateData.email = email;
        }
        if (password) {
            const salt = bcryptjs_1.default.genSaltSync(12);
            const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
            updateData.password = hashedPassword;
        }
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ message: "No changes provided" });
            return;
        }
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: updateData,
        });
        const { password: _ } = updatedUser, safeUser = __rest(updatedUser, ["password"]);
        res.json({ message: "User updated successfully", user: safeUser });
    }
    catch (error) {
        next(error);
    }
}));
// DELETE /api/users/:id
router.delete("/:id", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    if (userId !== id) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    try {
        const existing = yield prisma.user.findUnique({ where: { id } });
        if (!existing || existing.deletedAt !== null) {
            res.status(404).json({ message: "User not found or already deleted" });
            return;
        }
        const deletedUser = yield prisma.user.delete({ where: { id } });
        // Define a type for the new user object with password removed - Give me everything in the User type except the password field.
        const { password } = deletedUser, safeUser = __rest(deletedUser, ["password"]);
        res.json({ message: "User deleted successfully", deleted: safeUser });
    }
    catch (error) {
        next(error);
    }
}));
// Soft-delete user
router.delete("/:id/deactivate", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const id = parseInt(req.params.id);
    if (userId !== id) {
        res.status(403).json({ message: "Access denied" });
        return;
    }
    try {
        const existing = yield prisma.user.findUnique({ where: { id } });
        if (!existing || existing.deletedAt !== null) {
            res.status(404).json({ message: "User not found or already deleted" });
            return;
        }
        const updated = yield prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        res.json({ message: "User soft-deleted successfully", deletedUserId: updated.id });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
