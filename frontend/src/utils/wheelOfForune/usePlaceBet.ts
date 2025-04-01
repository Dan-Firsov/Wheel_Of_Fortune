import { parseUnits } from 'ethers';
import { WOF_ABI, WOF_ADDRESS } from '../../constants/contract/wheelOfFortune';
import useContractBalanceUpdates from '../../shared/hooks/useContractBalance';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useState } from 'react';

export const usePlaceBet = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const { isPending, writeContractAsync } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { refetch } = useContractBalanceUpdates();

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
        value: amount,
      });
      setHash(txHash);
      if (hash && isSuccess) {
        refetch();
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
