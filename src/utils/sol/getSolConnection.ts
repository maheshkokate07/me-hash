import { Connection } from "@solana/web3.js";
import type { networkType } from "@/slices/appSlice";

let mainnetConnection: Connection | null = null;
let devnetConnection: Connection | null = null;

export const getSolConnection = (network: networkType) => {
     if (network === 'MAINNET') {
          if (!mainnetConnection)
               mainnetConnection = new Connection(import.meta.env.VITE_SOL_API_MAINNET);
          return mainnetConnection;
     } else {
          if (!devnetConnection)
               devnetConnection = new Connection(import.meta.env.VITE_SOL_API_DEVNET);
          return devnetConnection;
     }
}