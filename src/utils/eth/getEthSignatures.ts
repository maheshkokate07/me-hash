import type { networkType, Signature } from "@/slices/appSlice";
import axios from "axios";

const chainids = {
     "MAINNET": 1,
     "DEVNET": 11155111
}

const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;

export async function getEthSignatures(address: string, activeNetwork: networkType) {
     try {
          const url = `https://api.etherscan.io/v2/api
                    ?apikey=${apiKey}
                    &module=account
                    &action=txlist
                    &address=${address}
                    &startblock=-1
                    &offset=100
                    &sort=desc
                    &chainid=${chainids[activeNetwork]}`;

          const res = await axios(url.replace(/\s/g, ""));
          if (!res.data || res.data.status !== "1" || !res.data.result) return [];

          const signatures: Signature[] = res.data.result.map((tx: any) => ({
               signature: tx.hash,
               slot: Number(tx.blockNumber),
               blockTime: Number(tx.timeStamp),
               confirmationStatus: tx.txreceipt_status === "1" ? "confirmed" : "failed",
          }));

          return signatures;
     } catch (err) {
          throw err;
     }
}