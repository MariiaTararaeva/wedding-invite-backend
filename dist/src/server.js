"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT || 5005;
app_1.app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
