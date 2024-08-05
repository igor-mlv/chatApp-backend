import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import loginRoute from "./routes/loginRoute.js";
import registerUserRoute from "./routes/registerUserRoute.js";
import findUserByUserName from "./routes/findUserByUserNameRoute.js";
import getAllUsers from "./routes/getAllUsers.js";
import { v4 as uuidv4 } from "uuid";
import USERS_DATABASE from './user_database/index.js';

const app = express();

// Use CORS middleware to allow requests from frontend
app.use(cors({
    origin: "*", // Allow requests from this origin
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
        origin: "*"
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

    let currentUserID;
    socket.on("setUserIDtoSocketID", (userID) => {
        if (typeof userID === 'string') {
            userSockets[userID] = socket.id;
            currentUserID = userID;
        } else {
            console.error('userID must be a string');
        }
    })

    socket.on("createChat", (users) => {
        //generate a unique id for the chat
        const chatID = uuidv4();
        console.log(users, "from create chat");

        // send the chat id to all users
        users.forEach((user) => {
            const socketID = userSockets[user.id];
            if (socketID) {
                console.log(socketID, userSockets);
                io.to(socketID).emit("joinChat", chatID);
            }
        });

        //also current socket join the chat room,
        //because users contains only the selected users for new chat, 
        //not the current user
        // io.socket.emit("joinChat", chatID);
        io.to(socket.id).emit("joinChat", chatID);
    });

    socket.on("joinChat", (chatID) => {
        socket.join(chatID);

        // Update the user's room list
        const user = USERS_DATABASE.find(
            (u) => u.id === currentUserID
        );

        // Ensure the user exists and the chatID is not already in the rooms
        if (user && !user.rooms.includes(chatID)) {
            user.rooms.push(chatID);
        }

        console.log(USERS_DATABASE);
    });
});
httpServer.listen(3001); 