"use strict";
// import express from "express";
// import { isAuthenticated } from "../middleware/auth";
// import { createCourse } from "../services/course_service";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const orderRouter=express.Router();
// orderRouter.post("/create-order", isAuthenticated, createCourse);
// export default orderRouter;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const order_controller_1 = require("../controllers/order_controller");
const user_controller_1 = require("../controllers/user_controller");
const orderRouter = express_1.default.Router();
orderRouter.post("/create-order", user_controller_1.updateAccessToken, auth_1.isAuthenticated, order_controller_1.createOrder);
orderRouter.get("/get-orders", user_controller_1.updateAccessToken, auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getAllOrders);
exports.default = orderRouter;
