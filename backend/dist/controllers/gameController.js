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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectWinner = selectWinner;
exports.createNewGameSession = createNewGameSession;
const ethers_1 = require("ethers");
const contract_1 = __importDefault(require("../config/contract"));
const gameEvents_1 = require("../events/gameEvents");
function selectWinner() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract_1.default.spinWheel();
            yield tx.wait();
            console.log(`The winner has been chosen! txHash: ${tx.hash} `);
        }
        catch (error) {
            console.error("Winner selection error:", error);
        }
    });
}
function createNewGameSession() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract_1.default.createGameSession();
            yield tx.wait();
            console.log(`The new game session has been chosen! txHash: ${tx.hash} `);
        }
        catch (error) {
            console.error("Winner selection error:", error);
        }
    });
}
contract_1.default.on("GameStarted", (endsAt) => {
    console.log(`GameStarted event received. The game will end at: ${endsAt.toString()}`);
    gameEvents_1.eventEmitter.emit("startGameTimer", Number(endsAt));
});
contract_1.default.on("GameResult", (newWinner, totalPot) => {
    console.log(`"GameResult event received. The game winner: ${newWinner}, winning ${Number((0, ethers_1.formatEther)(totalPot))} ETH`);
    const gameResult = {
        winner: newWinner,
        winningPot: Number((0, ethers_1.formatEther)(totalPot)),
    };
    gameEvents_1.eventEmitter.emit("gameUpdate", { type: "gameResult", gameResult });
});
contract_1.default.on("GameFinished", (startAt) => {
    console.log(`GameFinished event received. New game will start at: ${startAt.toString()}`);
    gameEvents_1.eventEmitter.emit("startNewSessionTimer", Number(startAt));
});
gameEvents_1.eventEmitter.on("gameEnded", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Winner selecting");
    yield selectWinner();
}));
gameEvents_1.eventEmitter.on("createNewGameSession", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Starting a new game session");
    yield createNewGameSession();
}));
