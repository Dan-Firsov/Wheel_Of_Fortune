// import { useConnectionStore, useWalletInfo } from "../store/ConnectionStore"
// import { getBrowsProvider } from "./initBrowsProvider"

// export const initConnections = async () => {
//     const { address,setAddress } = useWalletInfo.getState()
//     const { setBrowsContract, setSigContract} = useConnectionStore.getState()

//     try {
//         await setBrowsContract()
//         await setSigContract()
//         if(!address) {
//             const provider = getBrowsProvider()
//             const signer = await provider.getSigner()
//             const address = await signer.getAddress()
//             setAddress(address)
//         }
//     } catch (error) {
//         console.error("Connect initialization error:", error)
//     }
// }