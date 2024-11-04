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
exports.updateGameState = updateGameState;
exports.getCurrentGameState = getCurrentGameState;
let currentTotalPot = 0;
let currentParticipantCount = 0;
let participants = [];
function updateGameState(newTotalPot, newParticipantCount, updatedParticipants) {
    currentTotalPot = newTotalPot;
    currentParticipantCount = newParticipantCount;
    participants = updatedParticipants;
}
function getCurrentGameState() {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            totalPot: currentTotalPot,
            participantCount: currentParticipantCount,
            participants,
        };
    });
}
