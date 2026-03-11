import { ethers } from "ethers";
import type { networkType } from "@/slices/appSlice";

let mainnetConnection: ethers.JsonRpcProvider | null = null;
let devnetConnection: ethers.JsonRpcProvider | null = null;

export const getEthConnection = (network: networkType) => {
     if (network === 'MAINNET') {
          if (!mainnetConnection)
               mainnetConnection = new ethers.JsonRpcProvider(import.meta.env.VITE_ETH_API_MAINNET);
          return mainnetConnection;
     } else {
          if (!devnetConnection)
               devnetConnection = new ethers.JsonRpcProvider(import.meta.env.VITE_ETH_API_DEVNET);
          return devnetConnection;
     }
}