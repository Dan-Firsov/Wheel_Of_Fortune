"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeContract = initializeContract;
exports.getContract = getContract;
exports.getProvider = getProvider;
const ethers_1 = require("ethers");
const WheelOfFortune_json_1 = require("../WheelOfFortune.json");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let contract;
let provider;
function initializeContract() {
    if (!contract) {
        if (!process.env.RPC_URL || !process.env.PRIVATE_KEY || !process.env.CONTRACT_ADDRESS) {
            throw new Error("RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS must be defined in the .env file");
        }
        provider = new ethers_1.ethers.WebSocketProvider(process.env.RPC_URL);
        const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
        contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, WheelOfFortune_json_1.abi, wallet);
        console.log("Contract initialized");
    }
}
function getContract() {
    return contract;
}
function getProvider() {
    return provider;
}
