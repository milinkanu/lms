import { clerkClient } from "@clerk/express"
import Course from "../models/Course.model.js"
import { v2 as cloudinary } from "cloudinary"
import User from "../models/User.model.js"
import Purchase from "../models/Purchase.model.js"

//update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = req.auth();

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }
        });

        res.json({
            status: "success",
            message: "User role updated successfully. You can publish your course now.",
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}

// Add New Course
export const addCourse = async (req, res) => {
    try {
        const { userId } = req.auth();
        let { courseTitle, courseDescription, coursePrice, discount, courseContent } = req.body;
        const imageFile = req.file;

        if (req.body.courseData) {
            const courseData = JSON.parse(req.body.courseData);
            courseTitle = courseData.courseTitle;
            courseDescription = courseData.courseDescription;
            coursePrice = courseData.coursePrice;
            discount = courseData.discount;
            courseContent = courseData.courseContent;
        }

        if (!imageFile) {
            return res.json({
                status: "error",
                message: "Image is required.",
            });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const educator = await User.findOne({ id: userId });

        if (!educator) {
            return res.json({
                status: "error",
                message: "Educator not found",
            });
        }

        const newCourse = await Course.create({
            courseTitle,
            courseDescription,
            coursePrice,
            discount,
            educator: educator._id,
            courseThumbnail: imageUpload.secure_url,
            isPublished: true,
            courseContent,
        });

        res.json({
            status: "success",
            message: "Course added successfully.",
            course: newCourse,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}

// export const addCourse = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { courseTitle, courseDescription, coursePrice, discount } = req.body;
//         const imageFile = req.file;

//         if(!imageFile){
//             return res.json({
//                 status: "error",
//                 message: "Image is required.",
//             });
//         }

//         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

//         const educator = await User.findOne({ id: userId });

//         if(!educator){
//             return res.json({
//                 status: "error",
//                 message: "Educator not found",
//             });
//         }

//         const newCourse = await Course.create({
//             courseTitle,
//             courseDescription,
//             coursePrice,
//             discount,
//             educator: educator._id,
//             courseThumbnail: imageUpload.secure_url,
//             isPublished: true,
//         });

//         res.json({
//             status: "success",
//             message: "Course added successfully.",
//             course: newCourse,
//         });
//     } catch (error) {
//         res.json({
//             status: "error",
//             message: error.message,
//         });
//     }
// }

// Get Courses By Educator

export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        const educator = await User.findOne({ id: userId });

        if (!educator) {
            return res.json({
                status: "error",
                message: "Educator not found",
            });
        }

        const courses = await Course.find({ educator: educator._id });
        res.json({
            status: "success",
            message: "Courses fetched successfully.",
            courses,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}

// Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses)

export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const educator = await User.findOne({ id: userId });

        if (!educator) {
            return res.json({
                status: "error",
                message: "Educator not found",
            });
        }

        const courses = await Course.find({ educator: educator._id });
        const courseIds = courses.map(c => c._id);

        const enrolledStudents = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });
        const totalEarning = enrolledStudents.reduce((total, purchase) => total + purchase.amount, 0);
        const enrolledStudentsCount = enrolledStudents.length;
        const coursesCount = courses.length;
        res.json({
            status: "success",
            message: "Dashboard data fetched successfully.",
            totalEarning,
            enrolledStudentsCount,
            coursesCount,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}

// Get Enrolled Students Data with Purchase Data

export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const educator = await User.findOne({ id: userId });

        if (!educator) {
            return res.json({
                status: "error",
                message: "Educator not found",
            });
        }

        const courses = await Course.find({ educator: educator._id });
        const courseIds = courses.map(c => c._id);

        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
            .populate('userId', 'name imageUrl')
            .populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(p => ({
            studentId: p.userId,
            courseTitle: p.courseId.courseTitle,
            purchaseDate: p.createdAt,
        }));

        res.json({
            status: "success",
            message: "Enrolled students data fetched successfully.",
            enrolledStudents,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}


