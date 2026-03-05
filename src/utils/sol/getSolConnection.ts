import { Connection } from "@solana/web3.js";
import type { networkType } from "@/slices/appSlice";

export const getSolConnection = (network: networkType) => {
     const rpcUrl =
          network === "MAINNET"
               ? import.meta.env.VITE_SOL_API_MAINNET
               : import.meta.env.VITE_SOL_API_DEVNET;

     return new Connection(rpcUrl);
};