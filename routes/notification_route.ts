import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotification } from "../controllers/notification_controller";
import { updateAccessToken } from "../controllers/user_controller";

const notificationRouter = express();

notificationRouter.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);

notificationRouter.put(
    "/update-notification/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin"),
    updateNotification
  );

export default notificationRouter;
