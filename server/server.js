import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import http from "http"
import bodyParser from "body-parser"
import postRouter from "./routes/posts.js";
import userRouter from "./routes/users.js";
import { Server } from "socket.io";

const app = express()
dotenv.config()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))  //increase data limit for file64 data convert
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
        cors({
                origin: "*",
                credentials: true,            //access-control-allow-credentials:true
                optionSuccessStatus: 200,

        })
)


mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.error('MongoDB connection error:', error));


const server = http.createServer(app);

const io = new Server(server, {
        cors: {
                origin: "*",  // Replace "*" with your frontend URL in production
                methods: ["GET", "POST", "PUT", "DELETE"],
        },
});

// Middleware to add io to req so it can be used in routes
app.use((req, res, next) => {
        req.io = io;
        next();
});


app.use("/posts", postRouter)
app.use("/users", userRouter)


app.get('/', (req, res) => {
        res.send('Server is ready')
});

app.use((err, req, res, next) => {
        res.status(500).send({ message: err.message });
});


io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id}`);
        });
});


const port = process.env.PORT || 3111;

app.listen(port, () => {
        console.log(`Server at http://localhost:${port}`)

})