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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../../prisma/client"));
const route_guard_middleware_1 = require("../middleware/route-guard-middleware");
const router = express_1.default.Router();
// Signup
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, guestId } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return;
    }
    try {
        const existingUser = yield client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }
        const salt = bcryptjs_1.default.genSaltSync(12);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        const newUser = yield client_1.default.user.create({
            data: { email, password: hashedPassword },
        });
        if (guestId) {
            yield client_1.default.invitation.updateMany({
                where: { userId: null, guestId },
                data: { userId: newUser.id, guestId: null },
            });
        } // Update invitations created as guest with the new user ID when a guest signs up
        res.status(201).json({ user: { id: newUser.id, email: newUser.email }, message: "User created" });
    }
    catch (err) {
        next(err);
    }
}));
// Login
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, guestId } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and password required" });
        return;
    }
    try {
        const user = yield client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isValid = bcryptjs_1.default.compareSync(password, user.password);
        if (!isValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        if (guestId) {
            yield client_1.default.invitation.updateMany({
                where: { userId: null, guestId },
                data: { userId: user.id, guestId: null },
            });
        } // Update invitations created as guest with the user ID when a guest logs in
        const payload = { userId: user.id, email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
        });
        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email }
        });
    }
    catch (err) {
        next(err);
    }
}));
// Verify
router.get("/verify", route_guard_middleware_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield client_1.default.user.findUnique({
            where: { id: Number((_a = req.tokenPayload) === null || _a === void 0 ? void 0 : _a.userId) },
            select: { id: true, email: true },
        });
        res.json({ user: user + "my user" });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
//
