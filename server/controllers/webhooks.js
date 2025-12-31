import { Webhook } from "svix";
import User from "../models/User.model.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.model.js";
import Course from "../models/Course.model.js";

// Api controller funtion to Manage Clerk User with database

export const clerkWebhookHandler = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        console.log("Verifying webhook signature...");
        await whook.verify(req.rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });
        console.log("Webhook verified successfully.");

        const { type, data } = req.body;
        console.log("Webhook Type:", type);

        switch (type) {
            case "user.created": {
                const userData = {
                    id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0]?.email_address || `no-email-${data.id}@example.com`,
                    imageUrl: data.image_url,
                }

                await User.create(userData);
                res.json({
                    status: "success",
                    message: "User created successfully",
                });
                break;
            }
            case "user.updated": {
                const userData = {
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0]?.email_address || `no-email-${data.id}@example.com`,
                    imageUrl: data.image_url,
                }

                await User.findOneAndUpdate({ id: data.id }, userData);
                res.json({
                    status: "success",
                    message: "User updated successfully",
                });
                break;
            }
            case "user.deleted": {
                await User.findOneAndDelete({ id: data.id });
                res.json({
                    status: "success",
                    message: "User deleted successfully",
                });
                break;
            }
            default:
                break;
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: error.message,
        });
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        res.status(400).send("Webhook Error: " + error.message);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;


            const session = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { purchaseId } = session.data[0].metadata;
            const purchase = await Purchase.findById(purchaseId);
            const userData = await User.findById(purchase.userId);
            const courseData = await Course.findById(purchase.courseId);

            courseData.enrolledStudents.push(userData)
            await courseData.save();

            userData.enrolledCourses.push(courseData._id)
            await userData.save();

            purchase.status = "completed";
            await purchase.save();

            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripe.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { purchaseId } = session.data[0].metadata;
            const purchase = await Purchase.findById(purchaseId);
            const userData = await User.findById(purchase.userId);
            const courseData = await Course.findById(purchase.courseId);

            purchase.status = "failed";
            await purchase.save();

            break;
        }
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
}
