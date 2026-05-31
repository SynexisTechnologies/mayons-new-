import { NextFunction, Request, Response } from "express";
import { APIError } from "../errors/ApiErrors";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role?: string };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(new APIError(401, "Access Token out"));

  let decoded: string | JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_SECRETE_TOKEN!) as JwtPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) return next(new APIError(401, "Access Token Expired"));
    if (err instanceof JsonWebTokenError) return next(new APIError(401, "Invalid Access Token"));
    return next(new APIError(401, "Error Verifying Access Token"));
  }

  if (!decoded || typeof decoded === "string") return next(new APIError(401, "Access Token Payload Error"));

  req.user = {
    id: (decoded as JwtPayload).id,
    role: (decoded as JwtPayload).role,
  };

  next();
};
