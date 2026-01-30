import { getTokenPrice } from "../price/getTokenPrice";
import { solConnection } from "./connection";
import { PublicKey } from "@solana/web3.js";

export async function getSolBalance(address: string, currency: string = "usd") {
     try {
          const publicKey = new PublicKey(address);

          const balanceLamports = await solConnection.getBalance(publicKey);
          const balanceSol = balanceLamports / 1e9;

          const solPrice = await getTokenPrice("SOL", currency);

          return {
               balance: balanceSol,
               balanceUsd: balanceSol * solPrice,
          };
     } catch (err) {
          throw err;
     }
}