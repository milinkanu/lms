import express from "express";
import { updateRoleToEducator, addCourse, getEducatorCourses, educatorDashboardData, getEnrolledStudentsData } from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

//Add educator role
educatorRouter.get("/update-role-to-educator", updateRoleToEducator);
educatorRouter.post("/add-course", upload.single("image"), protectEducator, addCourse);
educatorRouter.get("/get-educator-courses", protectEducator, getEducatorCourses);
educatorRouter.get("/get-educator-dashboard-data", protectEducator, educatorDashboardData);
educatorRouter.get("/get-enrolled-students-data", protectEducator, getEnrolledStudentsData);

export default educatorRouter;