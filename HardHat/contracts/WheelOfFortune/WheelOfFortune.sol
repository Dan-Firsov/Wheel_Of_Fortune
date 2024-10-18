// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract WheelOfFortune {

    address  owner;
    uint constant DURATION = 5 minutes;
    uint constant FEE = 10;
    mapping (address => uint256) public balance;

    struct GameSession {
        address[] participants;
        uint256[] participantBets;
        mapping (address => uint) participantIndex;
        uint256 totalPot;
        uint256 endsGameAt;
        bool start;
        bool stopped;
    }

    GameSession[] public GameSessions;
    

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event BetPlaced(address indexed user, uint256 amount);
    event GameStarted(uint256 endsAt);
    event GameCreated();
    event GameResult (address indexed winner, uint256 totalAmount, address[] participants);

    event ParticipantsUpdated(address[] participants, uint256[] bets);
    event TotalUpdate(uint256 newTotalPot, uint participantCount);


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
            current += session.participantBets[i];
            if(random < current) {
                winner = session.participants[i];
                uint256 payout = session.totalPot - (session.totalPot * FEE / 100);
                balance[winner] += payout;

                break;
            }
        }

        session.stopped = true;
        emit GameResult(winner,session.totalPot,session.participants);
        emit TotalUpdate(0,0);


        createGameSession();

    }

    function placeBet(uint256 amount) external {
        require(balance[msg.sender] >= amount, "Insufficient balance");
        require(GameSessions.length > 0, "No active game sessions");
        GameSession storage session = GameSessions[GameSessions.length -1];
        require(!session.stopped, "Session already completed");

        balance[msg.sender] -= amount;


        uint256 betIndex;

        if (session.participantIndex[msg.sender] == 0 && (session.participants.length == 0 || session.participants[0] != msg.sender)) {
            session.participants.push(msg.sender);
            session.participantBets.push(amount);
            betIndex = session.participants.length - 1;
            session.participantIndex[msg.sender] = betIndex + 1;
        } else {
            betIndex = session.participantIndex[msg.sender] - 1; 
            session.participantBets[betIndex] += amount;
        }

        session.totalPot += amount;

        emit ParticipantsUpdated(session.participants, session.participantBets);
        emit BetPlaced(msg.sender, amount);
        emit TotalUpdate(session.totalPot,session.participants.length);

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