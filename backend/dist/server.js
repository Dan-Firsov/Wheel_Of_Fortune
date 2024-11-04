"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const gameEvents_1 = require("./events/gameEvents");
const gameRoutes_1 = __importDefault(require("./routes/gameRoutes"));
const eventSubscriptions_1 = require("./config/eventSubscriptions");
const contract_1 = require("./config/contract");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use("/api", gameRoutes_1.default);
(0, contract_1.initializeContract)();
(0, eventSubscriptions_1.initializeEventSubscriptions)();
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
gameEvents_1.eventEmitter.on("gameUpdate", (update) => {
    io.emit("gameUpdate", update);
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
