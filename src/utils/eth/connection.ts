import { ethers } from "ethers";

export const ethConnection = new ethers.JsonRpcProvider(import.meta.env.VITE_ETH_API);