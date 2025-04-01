import { useState } from 'react';
import { usePlaceBet } from '../../../utils/wheelOfForune/usePlaceBet';
import { useWithdrawBet } from '../../../utils/wheelOfForune/useWithdrawBet';

enum ErrorMsg {
  PROVIDEVALUE = 'Please provide value.',
  LOWBALANCE = 'Insufficient funds on balance',
  NOACTIVEGAME = 'No active game sessions',
  SESSIONCOMPLETED = 'Session already completed',
  LOWBETBALANCE = 'Insufficient bet balance',
  NOTPLACEDBET = 'You have not placed any bets',
  GAMESTARTED = 'Game has started',
}

export const useBetActions = () => {
  const { placeBet } = usePlaceBet();
  const { withdrawBet } = useWithdrawBet();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const handleBet = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (value) {
        await placeBet(value);
        setValue('');
        setErrorMessage('');
      } else {
        console.log(ErrorMsg.PROVIDEVALUE);
        handleError(ErrorMsg.PROVIDEVALUE);
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'reason' in error &&
        typeof error.reason === 'string'
      ) {
        const errorReason = error.reason || '';
        switch (!!errorReason) {
          case errorReason.includes(ErrorMsg.LOWBALANCE):
            handleError(ErrorMsg.LOWBALANCE);
            break;
          case errorReason.includes(ErrorMsg.NOACTIVEGAME):
            handleError(ErrorMsg.NOACTIVEGAME);
            break;
          case errorReason.includes(ErrorMsg.SESSIONCOMPLETED):
            handleError(ErrorMsg.SESSIONCOMPLETED);
            break;
          default:
            console.error('Unexpected error:', error);
        }
      }
    }
  };

  const handleRemoveBet = async () => {
    try {
      if (value) {
        await withdrawBet(value);
        setValue('');
        setErrorMessage('');
      } else {
        console.log(ErrorMsg.PROVIDEVALUE);
        handleError(ErrorMsg.PROVIDEVALUE);
      }
    } catch (error) {
      {
        if (
          typeof error === 'object' &&
          error !== null &&
          'reason' in error &&
          typeof error.reason === 'string'
        ) {
          const errorReason = error.reason || '';
          switch (!!errorReason) {
            case errorReason.includes(ErrorMsg.LOWBETBALANCE):
              handleError(ErrorMsg.LOWBETBALANCE);
              break;
            case errorReason.includes(ErrorMsg.NOACTIVEGAME):
              handleError(ErrorMsg.NOACTIVEGAME);
              break;
            case errorReason.includes(ErrorMsg.NOTPLACEDBET):
              handleError(ErrorMsg.NOTPLACEDBET);
              break;
            case errorReason.includes(ErrorMsg.GAMESTARTED):
              handleError(ErrorMsg.GAMESTARTED);
              break;
            default:
              console.error('Unexpected error:', error);
          }
        }
      }
    }
  };

  const handleError = (errorMsg: string) => {
    setErrorMessage(errorMsg);
    setErrorVisible(true);
    setTimeout(() => {
      setErrorVisible(false);
    }, 2000);
  };

  return {
    value,
    setValue,
    errorMessage,
    errorVisible,
    handleBet,
    handleRemoveBet,
  };
};
