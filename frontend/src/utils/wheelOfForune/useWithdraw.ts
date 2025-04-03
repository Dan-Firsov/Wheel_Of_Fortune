import { parseUnits } from 'ethers';
import { useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { WOF_ABI, WOF_ADDRESS } from '../../constants/contract/wheelOfFortune';
import { useContractBalanceStore } from '../../store/useContractBalanceStore';

export const useWithdraw = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const { isPending, writeContractAsync } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { refetchBalance } = useContractBalanceStore.getState();

  const withdraw = async (value: string) => {
    if (isPending) {
      console.log('Withdraw is already processing a request. Please wait.');
      return;
    }

    try {
      const amount = parseUnits(value, 18);
      const txHash = await writeContractAsync({
        address: WOF_ADDRESS,
        abi: WOF_ABI,
        functionName: 'withdraw',
        args: [amount],
      });
      setHash(txHash);
      if (hash && isSuccess && refetchBalance) {
        refetchBalance();
        setHash(undefined);
      }
    } catch (error) {
      console.error('Error when calling “Withdraw” from contract');
      setHash(undefined);
      throw error;
    }
  };

  return { withdraw };
};
