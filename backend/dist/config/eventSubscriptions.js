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
exports.initializeEventSubscriptions = initializeEventSubscriptions;
const contract_1 = require("../config/contract");
const countsController_1 = require("../controllers/countsController");
const gameController_1 = require("../controllers/gameController");
const timerController_1 = require("../controllers/timerController");
const gameEvents_1 = require("../events/gameEvents");
const ethers_1 = require("ethers");
function initializeEventSubscriptions() {
    const contract = (0, contract_1.getContract)();
    if (!contract) {
        throw new Error("Contract is not initialized before subscribing to events.");
    }
    contract.on("TotalUpdate", (newTotalPot, participantCount) => {
        const totalUpdate = {
            totalPot: Number((0, ethers_1.formatEther)(newTotalPot)),
            participantCount: Number(participantCount),
        };
        (0, countsController_1.getCurrentGameState)().then(({ participants }) => {
            (0, countsController_1.updateGameState)(totalUpdate.totalPot, totalUpdate.participantCount, participants);
        });
        gameEvents_1.eventEmitter.emit("gameUpdate", { type: "totalUpdate", totalUpdate });
    });
    contract.on("ParticipantsUpdated", (addresses, bets) => {
        const updatedParticipants = addresses.map((address, index) => ({
            address,
            bet: Number((0, ethers_1.formatEther)(bets[index])),
        }));
        updatedParticipants.sort((a, b) => b.bet - a.bet);
        (0, countsController_1.getCurrentGameState)().then(({ totalPot, participantCount }) => {
            (0, countsController_1.updateGameState)(totalPot, participantCount, updatedParticipants);
        });
        gameEvents_1.eventEmitter.emit("gameUpdate", { type: "participantsUpdated", updatedParticipants });
    });
    contract.on("GameStarted", (endsAt) => {
        console.log(`GameStarted event received. Game ends at: ${endsAt.toString()}`);
        gameEvents_1.eventEmitter.emit("startGameTimer", Number(endsAt));
    });
    contract.on("GameResult", (newWinner, totalPot) => {
        console.log(`"GameResult event received. The game winner: ${newWinner}, winning ${Number((0, ethers_1.formatEther)(totalPot))} ETH`);
        const gameResult = {
            winner: newWinner,
            winningPot: Number((0, ethers_1.formatEther)(totalPot)),
        };
        gameEvents_1.eventEmitter.emit("gameUpdate", { type: "gameResult", gameResult });
    });
    contract.on("GameFinished", (startAt) => {
        console.log(`GameFinished event received. New game will start at: ${startAt.toString()}`);
        gameEvents_1.eventEmitter.emit("startNewSessionTimer", Number(startAt));
    });
    gameEvents_1.eventEmitter.on("startGameTimer", (endsAt) => {
        (0, timerController_1.startGameTimer)(endsAt);
    });
    gameEvents_1.eventEmitter.on("startNewSessionTimer", (startAt) => {
        console.log("Starting new game timer");
        (0, timerController_1.startNewSessionTimer)(startAt);
        gameEvents_1.eventEmitter.emit("gameUpdate", { type: "newSessionTimerStarted" });
    });
    gameEvents_1.eventEmitter.on("gameEnded", () => __awaiter(this, void 0, void 0, function* () {
        console.log("Winner selecting");
        yield (0, gameController_1.selectWinner)();
    }));
    gameEvents_1.eventEmitter.on("createNewGameSession", () => __awaiter(this, void 0, void 0, function* () {
        console.log("Starting a new game session");
        (0, countsController_1.updateGameState)(0, 0, []);
        yield (0, gameController_1.createNewGameSession)();
    }));
}
