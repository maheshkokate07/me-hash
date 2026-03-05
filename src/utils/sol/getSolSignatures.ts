import type { networkType } from "@/slices/appSlice";
import { PublicKey } from "@solana/web3.js";
import { getSolConnection } from "./getSolConnection";

export async function getSolSignatures(address: string, activeNetwork: networkType) {
     try {
          const solConnection = getSolConnection(activeNetwork);

          const pubKey = new PublicKey(address);
          const signatures = await solConnection.getSignaturesForAddress(pubKey, {
               // limit: 10,
               // before: "5Udt12EC5RwJU8XwgWa8GkZ1HxfvegZiRUEwXCE4qtTjr35AkuRSwWFaeFmhF8JvMdKu3UFL9nvatnGCjkGTJpv3"
          });
          
          return signatures;
     } catch (err) {
          throw err;
     }
}