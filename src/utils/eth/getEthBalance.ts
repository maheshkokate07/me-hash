import { ethers } from "ethers";
import { getTokenPrice } from "../price/getTokenPrice";
import type { networkType } from "@/slices/appSlice";
import { getEthConnection } from "./getEthConnection";

export async function getEthBalance(
     activeNetwork: networkType,
     address: string,
     currency: string = "usd",
     nativeOnly?: boolean
) {
     try {
          const ethConnection = getEthConnection(activeNetwork);

          const balanceWei = await ethConnection.getBalance(address);
          const balanceEth = Number(ethers.formatEther(balanceWei));

          let ethPriceUsd;
          if (!nativeOnly)
               ethPriceUsd = await getTokenPrice("ETH", currency);

          return {
               balance: balanceEth,
               priceUsd: ethPriceUsd,
          };
     } catch (err) {
          throw err;
     }
}