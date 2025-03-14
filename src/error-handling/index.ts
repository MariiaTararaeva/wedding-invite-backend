// module.exports = app => {
//   app.use((req, res) => {
//     // this middleware runs whenever requested page is not available
//     res.status(404).json({
//       message:
//         'This route does not exist, you should probably look at your URL or what your backend is expecting',
//     })
//   })

//   app.use((err, req, res) => {
//     // whenever you call next(err), this middleware will handle the error
//     // always logs the error
//     console.error('ERROR', req.method, req.path, err)

//     // only render if the error ocurred before sending the response
//     if (!res.headersSent) {
//       res.status(500).json({
//         message: 'Internal server error. Check the server console',
//       })
//     }
//   })
// }

// src/error-handling/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("💥 Error caught by middleware:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
