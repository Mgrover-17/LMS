// import express from "express";
// import { isAuthenticated } from "../middleware/auth";
// import { createCourse } from "../services/course_service";

// const orderRouter=express.Router();

// orderRouter.post("/create-order", isAuthenticated, createCourse);

// export default orderRouter;

import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order_controller";
import { updateAccessToken } from "../controllers/user_controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", updateAccessToken, isAuthenticated, createOrder);

orderRouter.get(
  "/get-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

export default orderRouter;
