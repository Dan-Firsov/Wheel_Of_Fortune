// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import {IWheelOfFortune} from "./IWheelOfFortune.sol";

contract WheelOfFortune {

    address  owner;
    uint constant DURATION = 5 minutes;
    uint constant FEE = 10;
    mapping (address => uint256) public balance;

    struct GameSession {
        address[] participants;
        mapping (address => uint) participantBet;
        uint256 totalPot;
        uint256 endsGameAt;
        bool start;
        bool stopped;
    }

    GameSession[] public GameSessions;
    

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event BetPlaced(address indexed user, uint256 amount);
    event WinnerSelected(address indexed winner, uint256 payout);
    event GameStarted(uint256 endsAt);
    event GameCreated();
    event GameResult (address indexed winner, uint256 totalAmount, address[] participants);


    constructor() {
        owner = msg.sender;
        createGameSession();
    }

    function createGameSession() internal {
        GameSession storage session = GameSessions.push();
        session.endsGameAt = 0;
        session.start = false;
        session.stopped = false;
        emit GameCreated();
    }


    function deposit() external payable{
        require(msg.value > 0, "Must send ETH");
        balance[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external  {
        require(balance[msg.sender] >= amount, "Insufficient funds on balance");
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw (msg.sender, amount);
    }

    function spinWheel() external returns (address winner) {
        require(GameSessions.length > 0, "No active game sessions");
        GameSession storage session = GameSessions[GameSessions.length -1];
        require(block.timestamp >= session.endsGameAt, "Game is still running");
        require(session.start, "Game not started");
        require(!session.stopped, "Session already completed");

        require(session.totalPot > 0, "Total pot is zero");

        uint random = uint(keccak256(abi.encodePacked(block.prevrandao, block.timestamp))) % session.totalPot;
        uint current = 0;

        for(uint i = 0; i < session.participants.length; i++) {
            address player = session.participants[i];
            current += session.participantBet[player];

            if(random < current) {
                winner = player;
                uint256 payout = session.totalPot - (session.totalPot * FEE / 100);
                balance[winner] += payout;

                break;
            }
        }

        session.stopped = true;
        emit GameResult(winner,session.totalPot,session.participants);

        createGameSession();

    }

    function placeBet(uint256 amount) external {
        require(balance[msg.sender] >= amount, "Insufficient balance");
        require(GameSessions.length > 0, "No active game sessions");
        GameSession storage session = GameSessions[GameSessions.length -1];
        require(!session.stopped, "Session already completed");

        balance[msg.sender] -= amount;
        session.participants.push(msg.sender);
        session.participantBet[msg.sender] += amount;
        session.totalPot += amount;

        emit BetPlaced(msg.sender, amount);

        if(session.participants.length >= 3 && !session.start) {
            session.start = true;
            session.endsGameAt = block.timestamp + DURATION;
            emit GameStarted(session.endsGameAt);
        }

    }

    function getParcticipants() external view returns (address[] memory) {
        require(GameSessions.length > 0, "No active game sessions");
        GameSession storage session = GameSessions[GameSessions.length -1];
        return session.participants;

    }

    function getTotalPot() external view returns (uint256) {
        require(GameSessions.length > 0, "No active game sessions");
        GameSession storage session = GameSessions[GameSessions.length -1];
        return session.totalPot;
    }

    function getBalance() external view returns (uint256) {
        return balance[msg.sender];
    }


}