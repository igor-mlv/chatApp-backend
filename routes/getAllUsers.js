import express from 'express';
import USERS_DATABASE from '../user_database/index.js';

const router = express.Router();

// Define REST API endpoint to find an existing user
router.get("/api/users/all", (req, res) => {
    const allUsers = USERS_DATABASE.map((user) => {
        return {
            id: user.id,
            userName: user.userName,
        };
    });

    // Check if user already exists
    if (allUsers) {
        return res.status(201).json(allUsers);
    }

    res.status(400).json({ error: "Sorry, can not get list of users" });
});


export default router;