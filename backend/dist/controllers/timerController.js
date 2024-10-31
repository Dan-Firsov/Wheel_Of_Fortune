"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameTimer = startGameTimer;
exports.startNewSessionTimer = startNewSessionTimer;
const gameEvents_1 = require("../events/gameEvents");
function startGameTimer(endsAt) {
    const interval = setInterval(() => {
        const timeLeft = endsAt * 1000 - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
            gameEvents_1.eventEmitter.emit("gameUpdate", { type: "gameEnded" });
            gameEvents_1.eventEmitter.emit("gameEnded");
        }
        else {
            gameEvents_1.eventEmitter.emit("gameUpdate", { type: "timerUpdate", timeLeft });
        }
    }, 1000);
}
function startNewSessionTimer(startAt) {
    const interval = setInterval(() => {
        const timeLeft = startAt * 1000 - Date.now();
        if (timeLeft <= 0) {
            clearInterval(interval);
            gameEvents_1.eventEmitter.emit("createNewGameSession");
            gameEvents_1.eventEmitter.emit("gameUpdate", { type: "newSessionStarted" });
        }
        else {
            gameEvents_1.eventEmitter.emit("gameUpdate", { type: "newSessionTimerUpdate", timeLeft });
        }
    }, 1000);
}
gameEvents_1.eventEmitter.on("startGameTimer", (endsAt) => {
    console.log("Starting game timer");
    startGameTimer(endsAt);
});
gameEvents_1.eventEmitter.on("startNewSessionTimer", (startAt) => {
    console.log("Starting new game timer");
    startNewSessionTimer(startAt);
    gameEvents_1.eventEmitter.emit("gameUpdate", { type: "newSessionTimerStarted" });
});
