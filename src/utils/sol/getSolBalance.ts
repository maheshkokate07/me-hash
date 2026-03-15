import type { networkType } from "@/slices/appSlice";
import { getTokenPrice } from "../price/getTokenPrice";
import { PublicKey } from "@solana/web3.js";
import { getSolConnection } from "./getSolConnection";

export async function getSolBalance(
     activeNetwork: networkType,
     address: string,
     currency: string = "usd",
     nativeOnly?: boolean
) {
     try {
          const solConnection = getSolConnection(activeNetwork);

          const publicKey = new PublicKey(address);
          const balanceLamports = await solConnection.getBalance(publicKey);
          const balanceSol = balanceLamports / 1e9;

          let solPriceUsd;
          if (!nativeOnly)
               solPriceUsd = await getTokenPrice("SOL", currency);

          return {
               balance: balanceSol,
               priceUsd: solPriceUsd,
          };
     } catch (err) {
          throw err;
     }
}