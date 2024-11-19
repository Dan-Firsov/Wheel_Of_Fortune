// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract WheelOfFortune {

    address  owner;
    uint32 constant RESULT_DURATION = 30 seconds;
    uint32 constant NEXT_GAME_DURATION = 10 seconds;
    uint8 constant FEE = 15;
    bool gameCreating = true;
    mapping (address => uint256) public balance;

    struct GameSession {
        address[] participants;
        uint256[] participantBets;
        mapping (address => uint) participantIndex;
        uint256 totalPot;
        address winner ;
        uint256 endsGameAt;
        uint256 nextGameStartAt;
        bool start;
        bool stopped;
    }

    GameSession[] public GameSessions;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event BetPlaced(address indexed user, uint256 amount);
    event WithdrawBet();
    event GameStarted(uint256 endsAt);
    event GameFinished(uint256 startAt);
    event GameResult (address indexed winner, uint256 totalAmount, address[] participants);
    event TotalUpdate(uint256 newTotalPot, uint participantCount, address[] participants, uint256[] bets);


    constructor() {
        owner = msg.sender;
        createGameSession();
    }

    function createGameSession() public onlyOwner {
        require(gameCreating, "Game sassion not over");
        gameCreating = false;
        GameSession storage session = GameSessions.push();
        session.endsGameAt = 0;
        session.start = false;
        session.stopped = false;
        session.totalPot = 0;
        session.winner = address(0);
        emit TotalUpdate(session.totalPot, session.participants.length,session.participants,session.participantBets);
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

    function spinWheel() external onlyOwner  {
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
                session.winner = session.participants[i];
                uint256 commission = (session.totalPot - session.participantBets[i]) * FEE / 100;
                uint256 payout = session.totalPot - commission;
                balance[session.winner] += payout;
                break;
            }
        }
        session.stopped = true;
        emit GameResult(session.winner,session.totalPot,session.participants);
        session.nextGameStartAt = block.timestamp + NEXT_GAME_DURATION;
        emit GameFinished(session.nextGameStartAt);
        gameCreating = true;
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

        emit BetPlaced(msg.sender, amount);
        emit TotalUpdate(session.totalPot, session.participants.length,session.participants,session.participantBets);

        if(session.participants.length >= 3 && !session.start) {
            session.start = true;
            session.endsGameAt = block.timestamp + RESULT_DURATION;
            emit GameStarted(session.endsGameAt);
        }
    }

    function withdrawBet(uint256 amount) external {
        require(GameSessions.length > 0, "No active game sessions");
        GameSession storage session = GameSessions[GameSessions.length - 1];
        require(!session.start, "Game has started");
        uint256 index = session.participantIndex[msg.sender];
        require(index > 0, "You have not placed any bets");
        uint256 betIndex = index - 1;
        require(session.participantBets[betIndex] >= amount, "Insufficient bet balance");
        session.participantBets[betIndex] -= amount;
        session.totalPot -= amount;
        balance[msg.sender] += amount;
        if (session.participantBets[betIndex] == 0) {
            uint256 lastIndex = session.participants.length - 1;
            if (betIndex != lastIndex) {
                session.participants[betIndex] = session.participants[lastIndex];
                session.participantBets[betIndex] = session.participantBets[lastIndex];

                session.participantIndex[session.participants[betIndex]] = betIndex + 1;
            }
            session.participants.pop();
            session.participantBets.pop();
            delete session.participantIndex[msg.sender];
        }
        emit TotalUpdate(session.totalPot, session.participants.length,session.participants,session.participantBets);
        emit WithdrawBet();
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