// auth.ts

import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user_controller";

// Define an interface that extends the Request interface
interface AuthenticatedRequest extends Request {
  user?: any; // Add the 'user' property here
}

// Middleware to check if the user is authenticated
export const isAuthenticated = CatchAsyncError(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(new ErrorHandler("Please login to access this account", 400));
    }

    try {
      // Verify the access token
      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;

      if (!decoded) {
        return next(new ErrorHandler("Access token is not valid", 400));
      }

      // Check if the token is expired and update if needed
      if (decoded.exp && decoded.exp <= Date.now() / 1000) {
        try {
          await updateAccessToken(req, res, next);
        } catch (error) {
          return next(error);
        }
      } else {
        // Retrieve user information from Redis
        const user = await redis.get(decoded.id);

        if (!user) {
          return next(new ErrorHandler("User not found", 400));
        }

        // Add user information to the request
        req.user = typeof user === 'string' ? JSON.parse(user) : user;

        next();
      }
    } catch (error) {
      return next(new ErrorHandler("Error verifying access token", 500));
    }
  }
);

// Middleware to authorize roles
export const authorizeRoles = (roleOrRoles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

    // Check if the user has the required role
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
};
