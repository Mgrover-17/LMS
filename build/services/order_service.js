"use strict";
// import { NextFunction, Request, Response} from "express";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import ErrorHandler from "../utils/ErrorHandler";
// import orderModel from "../models/order_model";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const order_model_1 = __importDefault(require("../models/order_model"));
//create new order
exports.newOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (data, res) => {
    const order = await order_model_1.default.create(data);
    res.status(201).json({
        success: true,
        order,
    });
});
//get all orders
const getAllOrdersService = async (res) => {
    const orders = await order_model_1.default.find().sort({ createdAt: -1 }); //to reverse the sequence i.e. latest on top
    res.status(201).json({
        success: true,
        orders,
    });
};
exports.getAllOrdersService = getAllOrdersService;
