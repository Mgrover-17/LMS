"use strict";
// auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncErrors_1 = require("./catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
const user_controller_1 = require("../controllers/user_controller");
// Middleware to check if the user is authenticated
exports.isAuthenticated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this account", 400));
    }
    try {
        // Verify the access token
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
        if (!decoded) {
            return next(new ErrorHandler_1.default("Access token is not valid", 400));
        }
        // Check if the token is expired and update if needed
        if (decoded.exp && decoded.exp <= Date.now() / 1000) {
            try {
                await (0, user_controller_1.updateAccessToken)(req, res, next);
            }
            catch (error) {
                return next(error);
            }
        }
        else {
            // Retrieve user information from Redis
            const user = await redis_1.redis.get(decoded.id);
            if (!user) {
                return next(new ErrorHandler_1.default("User not found", 400));
            }
            // Add user information to the request
            req.user = typeof user === 'string' ? JSON.parse(user) : user;
            next();
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Error verifying access token", 500));
    }
});
// Middleware to authorize roles
const authorizeRoles = (roleOrRoles) => {
    return (req, res, next) => {
        const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
        // Check if the user has the required role
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler_1.default("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
