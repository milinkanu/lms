import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.model.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findOne({ id: userId });

        if (!userData) {
            return res.json({
                status: "error",
                message: "User not found.",
            });
        }
        res.json({
            status: "success",
            message: "User data fetched successfully.",
            userData,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}

//Users Enrolled Courses

export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userData = await User.findOne({ id: userId }).populate({ path: "enrolledCourses" });

        if (!userData) {
            return res.json({
                status: "error",
                message: "User not found.",
            });
        }
        res.json({
            status: "success",
            message: "User enrolled courses fetched successfully.",
            enrolledCourses: userData.enrolledCourses,
        });
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}
// Purchase Course
export const purchaseCourse = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body;
        const { origin } = req.headers;
        const user = await User.findOne({ id: userId });
        const courseData = await Course.findById(courseId);

        console.log("Purchase request:", {
            userId: userId,
            courseId: courseId,
            userFound: !!user,
            courseFound: !!courseData
        });
        if (!userId) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
        }
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found." });
        }
        if (!courseData) {
            return res.status(404).json({ status: "error", message: "Course not found." });
        }

            if (!courseId) {
            return res.json({
                status: "error",
                message: "Course ID is required.",
            });
        }


        if (!user || !courseData) {
            return res.json({
                status: "error",
                message: "User or course not found.",
            });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId: user._id,
            amount: (courseData.coursePrice * (1 - courseData.discount / 100)).toFixed(2),

        }

        const newPurchase = await Purchase.create(purchaseData);

        // Stripe gateway initialization
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        // Creating line items for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                },
                unit_amount: Math.floor(newPurchase.amount) * 100,
            },
            quantity: 1,
        }]

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items,
            mode: "payment",
            metadata: {
                purchaseId: newPurchase._id.toString(),
            },

        })

        res.json({
            status: "success",
            message: "Payment session created successfully.",
            session_url: session.url,
        })
    } catch (error) {
        res.json({
            status: "error",
            message: error.message,
        });
    }
}
