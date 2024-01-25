// import { NextFunction, Request, Response} from "express";
// import { CatchAsyncError } from "../middleware/catchAsyncErrors";
// import ErrorHandler from "../utils/ErrorHandler";
// import orderModel from "../models/order_model";

// //create new order
// export const newOrder=CatchAsyncError(async (data:any, next: NextFunction, res:Response)=>{
//     const order=await orderModel.create(data);

//     res.status(201).json({
//         success: true,
//         order,
//       });
// })

import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order_model";

//create new order
export const newOrder = CatchAsyncError(async (data: any, res: Response) => {
  const order = await OrderModel.create(data);
  res.status(201).json({
    success: true,
    order,
  });
});

//get all orders
export const getAllOrdersService = async (res: Response) => {
  const orders = await OrderModel.find().sort({ createdAt: -1 }); //to reverse the sequence i.e. latest on top

  res.status(201).json({
    success: true,
    orders,
  });
};
