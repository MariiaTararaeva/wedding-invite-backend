"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const invitation_routes_1 = __importDefault(require("./routes/invitation.routes"));
const error_handling_1 = require("./error-handling");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/invitations", invitation_routes_1.default);
app.use("/api/user", user_routes_1.default);
// ⛔️ Catch-all route for 404s
app.use("*", (req, res) => {
    res.status(404).json({ success: false, error: "Endpoint not found" });
});
// 🧠 Global error handling middleware
app.use(error_handling_1.errorHandler);
