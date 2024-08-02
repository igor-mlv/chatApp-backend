// Mock database of users
const USERS_DATABASE = [
    { id: "1", socketID: "", userName: "superuser", isOnline: false, rooms: ["room1", "room2"] },
];

export const ROOMS_DATABASE = [
    { id: "room1", users: ["superuser"] },
];

export default USERS_DATABASE;