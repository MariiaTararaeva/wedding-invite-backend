import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import invitationRoutes from "./routes/invitation.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/invitations", invitationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
