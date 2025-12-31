import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkWebhookHandler } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";

//Initialize app
const app = express();

//Connect to MongoDB
await connectDB();
await connectCloudinary();

//Middleware
app.use((req, res, next) => {
    console.log(`DEBUG LOG: Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.use(cors()); //we can connect backend to any domain
app.use(clerkMiddleware());

//Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/clerk', express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}), clerkWebhookHandler);

app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
