import express from 'express';
import USERS_DATABASE from '../user_database/index.js';;

const router = express.Router();
// Define REST API endpoint to login an existing user
router.get("/api/login/:username", (req, res) => {
    const username = req.params.username;
    const user = USERS_DATABASE.find((u) => u.userName === username);

    // Check if user already exists
    if (user) {
        //reset all rooms when user refresh page or login again
        user.rooms = [];
        return res.status(201).json(user);
    }

    res.status(400).json({ error: "Sorry, can not find a user, register new one" });
});


export default router;