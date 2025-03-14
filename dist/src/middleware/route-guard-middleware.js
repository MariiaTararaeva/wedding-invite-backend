"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Missing Authorization header" });
        return;
    }
    try {
        const token = authHeader.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        req.userId = payload.userId; // Assign it directly
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }
        res.status(401).json({ message: "Invalid or expired token" });
    }
    const userId = req.userId;
    if (!userId) {
        const err = new Error("Unauthorized access");
        err.statusCode = 401;
        throw err;
    }
};
exports.isAuthenticated = isAuthenticated;
