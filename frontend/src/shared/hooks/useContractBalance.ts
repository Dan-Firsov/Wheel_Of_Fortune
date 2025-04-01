import { useAccount, useReadContract } from 'wagmi';
import { WOF_ABI, WOF_ADDRESS } from '../../constants/contract/wheelOfFortune';
import { formatUnits } from 'viem';

export default function useContractBalance() {
  const { address } = useAccount();

  const { data, refetch } = useReadContract({
    address: WOF_ADDRESS,
    abi: WOF_ABI,
    functionName: 'getBalance',
    query: {
      enabled: !!address,
    },
  });

  const balanceBigInt = data as bigint;
  const balance = balanceBigInt ? formatUnits(balanceBigInt, 18) : '0';

  return {
    address,
    balance,
    refetch,
  };
}
