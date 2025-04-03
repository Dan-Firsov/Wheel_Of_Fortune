import { useAccount, useReadContract } from 'wagmi';
import { WOF_ABI, WOF_ADDRESS } from '../../constants/contract/wheelOfFortune';
import { formatUnits } from 'viem';
import {
  setBalance,
  setRefetchBalance,
} from '../../store/useContractBalanceStore';
import { useEffect } from 'react';

export default function useContractBalance() {
  const { address } = useAccount();

  const { data, refetch, error } = useReadContract({
    address: WOF_ADDRESS,
    abi: WOF_ABI,
    functionName: 'getBalance',
    account: address,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (refetch) {
      setRefetchBalance(refetch);
    }
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      const balanceBigInt = data as bigint;
      const balance = formatUnits(balanceBigInt, 18);
      setBalance(balance);
    }
  }, [data]);

  if (error) {
    console.error('Fetch balance error:', error);
    return;
  }
}
