import { parseUnits } from 'ethers';
import { WOF_ABI, WOF_ADDRESS } from '../../constants/contract/wheelOfFortune';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { useContractBalanceStore } from '../../store/useContractBalanceStore';

export const usePlaceBet = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const { isPending, writeContractAsync } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { refetchBalance } = useContractBalanceStore.getState();

  const placeBet = async (value: string) => {
    if (isPending) {
      console.log('Place bet is already processing a request. Please wait.');
      return;
    }

    try {
      const amount = parseUnits(value, 18);
      const txHash = await writeContractAsync({
        address: WOF_ADDRESS,
        abi: WOF_ABI,
        functionName: 'placeBet',
        args: [amount],
      });
      setHash(txHash);
      if (hash && isSuccess && refetchBalance) {
        refetchBalance();
        setHash(undefined);
      }
    } catch (error) {
      console.error('Error when calling "PlaceBet” from contract');
      setHash(undefined);
      throw error;
    }
  };

  return { placeBet };
};
