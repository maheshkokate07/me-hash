import { ethers } from "ethers";
import { ethConnection } from "./connection";
import { getTokenPrice } from "../price/getTokenPrice";

export async function getEthBalance(address: string, currency: string = "usd") {
     try {
          const balanceWei = await ethConnection.getBalance(address);
          const balanceEth = Number(ethers.formatEther(balanceWei));

          const ethPriceUsd = await getTokenPrice("ETH", currency);

          return {
               balance: balanceEth,
               balanceUsd: balanceEth * ethPriceUsd,
          };
     } catch (err) {
          throw err;
     }
}