import { clerkClient } from "@clerk/express";

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
    try {
        const { userId } = req.auth();

        if (!userId) {
            return res.json({ status: 'error', message: 'Unauthorized' });
        }

        const user = await clerkClient.users.getUser(userId);

        if (user.publicMetadata.role !== 'educator') {
            return res.json({ status: 'error', message: 'Unauthorized access' });
        }

        next();

    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
}
