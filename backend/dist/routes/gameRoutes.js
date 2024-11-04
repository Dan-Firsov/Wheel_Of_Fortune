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
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const countsController_1 = require("../controllers/countsController");
const router = express_1.default.Router();
router.post("/new-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, gameController_1.createNewGameSession)();
        res.status(200).json({ message: "New game session started" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to start a new session" });
    }
}));
router.post("/select-winner", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, gameController_1.selectWinner)();
        res.status(200).json({ message: "Winner selected" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to select a winner" });
    }
}));
router.get("/game-state", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameState = yield (0, countsController_1.getCurrentGameState)();
        res.json(gameState);
    }
    catch (error) {
        console.error("Failed to get game state:", error);
        res.status(500).json({ error: "Failed to get game state" });
    }
}));
exports.default = router;
