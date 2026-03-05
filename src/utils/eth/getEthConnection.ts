import { ethers } from "ethers";
import type { networkType } from "@/slices/appSlice";

export const getEthConnection = (network: networkType) => {
     const rpcUrl =
          network === "MAINNET"
               ? import.meta.env.VITE_ETH_API_MAINNET
               : import.meta.env.VITE_ETH_API_DEVNET;

     return new ethers.JsonRpcProvider(rpcUrl);
};