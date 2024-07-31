import express from 'express';
import { v4 as uuidv4 } from "uuid";
import USERS_DATABASE from '../user_database/index.js';

const router = express.Router();

// Define REST API endpoint to register a new user
router.get("/api/register/:username", (req, res) => {
    const username = req.params.username;
    const user = USERS_DATABASE.find((u) => u.userName === username);

    // Check if user already exists
    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = {
        id: uuidv4(),
        socketID: "",
        userName: username,
        isOnline: false,
        rooms: [],
    };

    USERS_DATABASE.push(newUser); // Add user to database

    // Respond with the newly created user
    res.status(201).json(newUser);
});


export default router;