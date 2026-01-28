import { Connection } from "@solana/web3.js";

export const solConnection = new Connection(import.meta.env.VITE_SOL_API);