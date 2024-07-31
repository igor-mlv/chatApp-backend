import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import loginRoute from "./routes/loginRoute.js";
import registerUserRoute from "./routes/registerUserRoute.js";
import findUserByUserName from "./routes/findUserByUserNameRoute.js";
import getAllUsers from "./routes/getAllUsers.js";

const app = express();

// Use CORS middleware to allow requests from frontend
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
}));

// Define REST API endpoint to register a new user
// "/api/register/:username"
app.use(registerUserRoute);

// Define REST API endpoint to login an existing user
// "/api/login/:username"
app.use(loginRoute);

// Define REST API endpoint to find all users
// "/api/users/all"
app.use(getAllUsers);

// Define REST API endpoint to find an existing user
// "/api/users/:username"
app.use(findUserByUserName);

const httpServer = createServer(app);

// Initialize Socket.io server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    },
    methods: ["GET", "POST"],
});

// Create an object to store user IDs and their corresponding socket IDs
// userSockets[userID] = socketID
const userSockets = {};

// io is a server instance that contains all the sockets
io.on("connect", (socket) => {
    socket.on("setUser", (data) => {
        console.log(data);
    });

    socket.on("setUserIDtoSocketID", (userID) => {
        if (typeof userID === 'string') {
            userSockets[userID] = socket.id;
        } else {
            console.error('userID must be a string');
        }
    })
});

httpServer.listen(3001); 