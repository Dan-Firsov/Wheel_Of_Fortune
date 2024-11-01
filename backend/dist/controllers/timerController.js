"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameTimer = startGameTimer;
exports.startNewSessionTimer = startNewSessionTimer;
const contract_1 = require("../config/contract");
const gameEvents_1 = require("../events/gameEvents");
function getBlockTimestamp() {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = (0, contract_1.getProvider)();
        if (!provider) {
            throw new Error("Contract is not initialized");
        }
        const block = yield provider.getBlock("latest");
        if (!block) {
            throw new Error("Failed to retrieve block timestamp.");
        }
        return block.timestamp;
    });
}
function startGameTimer(endsAt) {
    return __awaiter(this, void 0, void 0, function* () {
        const blockTimestamp = yield getBlockTimestamp();
        let timeLeftSec = endsAt - blockTimestamp;
        const interval = setInterval(() => {
            console.log(`Time left: ${timeLeftSec} seconds`);
            if (timeLeftSec <= 0) {
                clearInterval(interval);
                gameEvents_1.eventEmitter.emit("gameUpdate", { type: "gameEnded" });
                gameEvents_1.eventEmitter.emit("gameEnded");
            }
            else {
                gameEvents_1.eventEmitter.emit("gameUpdate", { type: "timerUpdate", timeLeftSec });
                timeLeftSec--;
            }
        }, 1000);
    });
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
