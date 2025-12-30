import express from "express";
import 'dotenv/config';
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import { clerkWebhookHandler } from "./controllers/webhooks.js";

//Initialize app
const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(cors()); //we can connect backend to any domain

//Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/clerk', express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}), clerkWebhookHandler);

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
