import React from 'react';
import './walletActionButton.css';
import MyIcon from './assets/wallet.svg';
import Button from '../../../../../shared/common/button/Button';

interface WalletActionButtonProps {
  onClick: () => void;
}

export const WalletActionButton: React.FC<WalletActionButtonProps> = ({
  onClick,
}) => (
  <Button onClick={onClick} customClass='button'>
    <span className='button__text'>Deposit</span>
    <MyIcon />
  </Button>
);
