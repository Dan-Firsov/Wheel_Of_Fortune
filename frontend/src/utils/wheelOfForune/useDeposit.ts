import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WOF_ABI, WOF_ADDRESS } from '../../constants/contract/wheelOfFortune';
import useContractBalanceUpdates from '../../shared/hooks/useContractBalance';
import { useState } from 'react';

export const useDeposit = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const { isPending, writeContractAsync } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { refetch } = useContractBalanceUpdates();

  const deposit = async (value: string) => {
    if (isPending) {
      console.log('Deposit is already processing a request. Please wait.');
      return;
    }

    try {
      const amount = parseUnits(value, 18);
      const txHash = await writeContractAsync({
        address: WOF_ADDRESS,
        abi: WOF_ABI,
        functionName: 'deposit',
        value: amount,
      });
      setHash(txHash);
      if (hash && isSuccess) {
        refetch();
        setHash(undefined);
      }
    } catch (error) {
      console.error('Error when calling “Deposit” from contract');
      setHash(undefined);
      throw error;
    }
  };

  return { deposit };
};
