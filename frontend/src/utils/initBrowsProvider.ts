// import { ethers } from "ethers";

// export const getBrowsProvider = () => {
//   if (window.ethereum) {
//     if (window.ethereum.providers) {
//       const metaMaskProvider = window.ethereum.providers.find((p: any) => p.isMetaMask);
//       if (metaMaskProvider) {
//         return new ethers.BrowserProvider(metaMaskProvider);
//       }
//     }

//     if (window.ethereum.isMetaMask) {
//       return new ethers.BrowserProvider(window.ethereum);
//     }

//     return new ethers.BrowserProvider(window.ethereum);
//   } else {
//     throw new Error("No Ethereum provider found.");
//   }
// };