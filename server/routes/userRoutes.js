import express from "express";
import { getUserData, userEnrolledCourses, purchaseCourse, updateUserCourseProgress, getUserCourseProgress, addUserRatingToCourse } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase-course", purchaseCourse);

userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.get("/course-progress", getUserCourseProgress);
userRouter.post("/rate-course", addUserRatingToCourse);

export default userRouter;
