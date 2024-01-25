import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course_controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user_controller";

const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get("/get-course/:id", getSingleCourse);

courseRouter.get("/get-courses", getAllCourses);

courseRouter.get("/get-course-content/:id", updateAccessToken, isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", updateAccessToken, isAuthenticated, addQuestion);

courseRouter.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);

courseRouter.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview);

courseRouter.put("/add-reply", updateAccessToken, isAuthenticated, authorizeRoles("admin"), addReplyToReview);

courseRouter.delete("/delete-course/:id", updateAccessToken, isAuthenticated, authorizeRoles("admin"), deleteCourse);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);

export default courseRouter;
