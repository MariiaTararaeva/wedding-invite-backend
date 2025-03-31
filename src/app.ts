// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import invitationRoutes from "./routes/invitations.routes";
import { errorHandler } from "./error-handling";
import userRoutes from "./routes/user.routes";
import templatesRouter from './routes/templates.routes'


dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // allow Nuxt frontend
  credentials: true, // optional, for cookies/auth headers
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/users", userRoutes);
app.use('/api/templates', templatesRouter)

// Catch-all route for 404s
app.use("*", (req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

// Global error handling middleware
app.use(errorHandler);

 export { app };