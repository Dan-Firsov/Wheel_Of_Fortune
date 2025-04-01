import React from 'react';
import './walletActionButton.css';
import Button from '../../../../../shared/common/button/Button';
import { WalletSVG } from './assets/wallet';

interface WalletActionButtonProps {
  onClick: () => void;
}

export const WalletActionButton: React.FC<WalletActionButtonProps> = ({
  onClick,
}) => (
  <Button onClick={onClick} customClass='button'>
    <span className='button__text'>Deposit</span>
    <WalletSVG />
  </Button>
);
