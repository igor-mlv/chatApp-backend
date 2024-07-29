import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    },
    methods: ["GET", "POST"],
});

// Mock database of users
const USERS_DATABASE = [
    { id: "1", socketID: "", userName: "superuser", isOnline: false },
];

// Define REST API endpoint to get all users
app.get("/api/users", (req, res) => {
    res.json(USERS_DATABASE);
});


// Define REST API endpoint to get a user by ID
app.get("/api/users/:id", (req, res) => {
    const userID = req.params.id; // Get user ID from URL
    const user = USERS_DATABASE.find((u) => u.id === userID); // Find user by ID

    if (user) {
        res.json(user); // Return user if found
    } else {
        res.status(404).json({ error: "User not found" }); // Return 404 if not found
    }
});

// Define REST API endpoint to get all users
app.get("/api/register/:username", (req, res) => {
    const username = req.params.username;
    const user = USERS_DATABASE.find((u) => u.userName === username);

    // Check if user already exists
    if (user) {
        res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = {
        id: uuidv4(),
        socketID: "",
        userName: username,
        isOnline: false,
    };

    USERS_DATABASE.push(newUser); // Add user to database

    // Respond with the newly created user
    res.status(201).json(newUser);
});




// io is a server instance that contains all the sockets
io.on("connect", (socket) => {

});

httpServer.listen(3001); 