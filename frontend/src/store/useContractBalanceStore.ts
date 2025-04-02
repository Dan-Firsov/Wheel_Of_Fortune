import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { ReadContractErrorType } from 'viem';
import { create } from 'zustand';

type refetchBalanceType = (
  options?: RefetchOptions,
) => Promise<QueryObserverResult<unknown, ReadContractErrorType>>;

interface IContractBalanceStore {
  balance: string | null;
  refetchBalance: refetchBalanceType | null;
}

export const useContractBalanceStore = create<IContractBalanceStore>(() => ({
  balance: null,
  refetchBalance: null,
}));

export const setBalance = (balance: string | null) =>
  useContractBalanceStore.setState(() => ({ balance }));

export const setRefetchBalance = (refetchBalance: refetchBalanceType | null) =>
  useContractBalanceStore.setState(() => ({ refetchBalance }));
