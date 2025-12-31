import express from "express";
import { getUserData, userEnrolledCourses, purchaseCourse } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase-course", purchaseCourse);

export default userRouter;
