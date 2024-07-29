import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import loginRoute from "./routes/loginRoute.js";
import registerUserRoute from "./routes/registerUserRoute.js";

const app = express();
// Use CORS middleware to allow requests from frontend
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
}));

const httpServer = createServer(app);


// Initialize Socket.io server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    },
    methods: ["GET", "POST"],
});

// Define REST API endpoint to register a new user
// "/api/register/:username"
app.use(registerUserRoute);


// Define REST API endpoint to login an existing user
// "/api/login/:username"
app.use(loginRoute);



// io is a server instance that contains all the sockets
io.on("connect", (socket) => {

});

httpServer.listen(3001); 