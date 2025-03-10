import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import invitationRoutes from "./routes/invitation.routes";
import authRoutes from "./routes/auth.routes"; // If you have this too

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/invitations", invitationRoutes);
app.use("/api/auth", authRoutes); // optional

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
