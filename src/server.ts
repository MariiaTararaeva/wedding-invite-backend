import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
const PORT = process.env.PORT || 5025;
console.log("Using PORT: ", PORT);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});