"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
// Middleware configuration
const configureMiddleware = (app) => {
    // Trust proxy (important for deployments behind proxies like Heroku, Railway, etc.)
    app.set("trust proxy", 1);
    // Enable CORS
    app.use((0, cors_1.default)({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
    // Logging middleware (only used in development by default)
    app.use((0, morgan_1.default)("dev"));
    // Parsing incoming request bodies
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    // Cookie parser
    app.use((0, cookie_parser_1.default)());
};
exports.default = configureMiddleware;
