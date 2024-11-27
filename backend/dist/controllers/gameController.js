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
exports.selectWinner = selectWinner;
exports.createNewGameSession = createNewGameSession;
const contract_1 = require("../config/contract");
function selectWinner() {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = (0, contract_1.getContract)();
        if (!contract) {
            throw new Error("Contract is not initialized");
        }
        try {
            const tx = yield contract.spinWheel({
                gasLimit: 1000000,
            });
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
        const contract = (0, contract_1.getContract)();
        if (!contract) {
            throw new Error("Contract is not initialized");
        }
        try {
            const tx = yield contract.createGameSession();
            yield tx.wait();
            console.log(`The new game session has been chosen! txHash: ${tx.hash} `);
        }
        catch (error) {
            console.error("Winner selection error:", error);
        }
    });
}
