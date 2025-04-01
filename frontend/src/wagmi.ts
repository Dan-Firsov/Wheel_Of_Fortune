import { http, createConfig,} from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})