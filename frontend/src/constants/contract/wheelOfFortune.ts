import { Abi } from 'viem';
import { WheelOfFortuneABI } from './WheelOfFortuneABI';

export const WOF_ADDRESS = '0x026FB91F85c5772da859c7822C43de5c120e2481';
export const WOF_ABI = WheelOfFortuneABI as Abi;

export const wofContractConfig = {
  abi: WOF_ABI,
  address: WOF_ADDRESS,
};
