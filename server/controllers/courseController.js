import Course from "../models/Course.model.js";

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).select("-courseContent -enrolledStudents").populate({ path: "educator" });
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

// Get Course By Id
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = await Course.findById(id).populate({ path: "educator" });

        if (!courseData) {
            return res.json({
                status: "error",
                message: "Course not found",
            });
        }
        const course = courseData.toObject();

        // Remove lectureUrl if isPreview is false
        course.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    delete lecture.lectureUrl;
                }
            });
        });
        res.json({
            status: "success",
            message: "Course fetched successfully.",
            course,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}   
