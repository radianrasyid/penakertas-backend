import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid authorization header" });
  }

  const incomingToken = authHeader.split(" ")[1];
  if (!incomingToken)
    return res.status(401).json({
      status: "failed",
      message: "Invalid Token",
    });

  try {
    const decoded = jsonwebtoken.verify(
      incomingToken,
      process.env.JWT_SECRET_KEY as string
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: "failed", message: "Invalid Token" });
  }
};
