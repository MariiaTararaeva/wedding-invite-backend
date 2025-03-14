// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import invitationRoutes from "./routes/invitation.routes";
import { errorHandler } from "./error-handling";
import e from "express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invitations", invitationRoutes);

// ⛔️ Catch-all route for 404s
app.use("*", (req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

// 🧠 Global error handling middleware
app.use(errorHandler);

 export { app };