import { Webhook } from "svix";
import User from "../models/User.model.js";

// Api controller funtion to Manage Clerk User with database

export const clerkWebhookHandler = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { type, data } = req.body;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    name: data.first_name + " " + data.last_name,
                    email: data.email_addresses[0].email_address,
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
                    email: data.email_addresses[0].email_address,
                    imageUrl: data.image_url,
                }

                await User.findByIdAndUpdate(data.id, userData);
                res.json({
                    status: "success",
                    message: "User updated successfully",
                });
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
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

