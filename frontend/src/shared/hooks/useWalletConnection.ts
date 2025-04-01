import { sepolia } from 'viem/chains';
import { useConnect } from 'wagmi';

export const useWalletConnection = () => {
  const { connectors, connectAsync, isPending } = useConnect();

  const connectMetaMask = async () => {
    const metaMaskConnector = connectors.find(
      (connector) => connector.id === 'metaMaskSDK',
    );

    if (!metaMaskConnector) {
      const userChoice = window.confirm(
        'Wallet is not installed. Would you like to install MetaMask?',
      );
      if (userChoice) {
        window.open('https://metamask.io/download.html', '_blank');
      } else {
        console.log('User chose not to install MetaMask.');
      }
      return;
    }

    if (!isPending) {
      try {
        await connectAsync({
          connector: metaMaskConnector,
          chainId: sepolia.id,
        });
      } catch (error) {
        console.error('Wallet connection error:', error);
      }
    } else {
      console.log('Wallet is already processing a request. Please wait.');
    }
  };

  return {
    connectMetaMask,
  };
};
