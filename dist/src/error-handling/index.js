"use strict";
// module.exports = app => {
//   app.use((req, res) => {
//     // this middleware runs whenever requested page is not available
//     res.status(404).json({
//       message:
//         'This route does not exist, you should probably look at your URL or what your backend is expecting',
//     })
//   })
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, _next) => {
    console.error("💥 Error caught by middleware:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};
exports.errorHandler = errorHandler;
