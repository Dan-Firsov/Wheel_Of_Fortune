import { useEffect, useState } from 'react';
import { socket } from '../../../constants/api';

export enum GamePhase {
  WAITING = 'waiting',
  ONGOING = 'ongoing',
  DETERMINING = 'determining',
  NEXTGAMETIMER = 'nextGameTimer',
}

enum UpdateType {
  TIMERUPDATE = 'timerUpdate',
  GAMEENDED = 'gameEnded',
  GAMERESULT = 'gameResult',
  NEWSESSIONTIMERSTARTED = 'newSessionTimerStarted',
  NEWSESSIONTIMERUPDATE = 'newSessionTimerUpdate',
  NEWSESSIONSTARTED = 'newSessionStarted',
}

export const useGameSessionPanel = () => {
  const [gamePhase, setGamePhase] = useState(GamePhase.WAITING);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [newGameTimeLeft, setNewGameTimeLeft] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerPrize, setWinnerPrize] = useState<number | null>(null);

  useEffect(() => {
    socket.on('gameUpdate', (update) => {
      console.log('Received update:', update);
      switch (update.type) {
        case UpdateType.TIMERUPDATE:
          setTimeLeft(update.timeLeft);
          setGamePhase(GamePhase.ONGOING);
          break;
        case UpdateType.GAMEENDED:
          setGamePhase(GamePhase.DETERMINING);
          break;
        case UpdateType.GAMERESULT:
          setWinner(update.gameResult.winner);
          setWinnerPrize(update.gameResult.winningPot);
          break;
        case UpdateType.NEWSESSIONTIMERSTARTED:
          setNewGameTimeLeft(update.timeLeft || 0);
          setGamePhase(GamePhase.NEXTGAMETIMER);
          break;
        case UpdateType.NEWSESSIONTIMERUPDATE:
          setNewGameTimeLeft(update.timeLeft);
          break;
        case UpdateType.NEWSESSIONSTARTED:
          setWinner(null);
          setTimeLeft(null);
          setNewGameTimeLeft(null);
          setGamePhase(GamePhase.WAITING);
          break;
        default:
          break;
      }
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  return {
    gamePhase,
    timeLeft,
    newGameTimeLeft,
    winner,
    winnerPrize,
  };
};
