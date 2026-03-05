import { Connection, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";

export const solConnection = new Connection("https://solana-devnet.g.alchemy.com/v2/FkBMdsbA442d5NhwxjyRg", "confirmed");

export const transferSol = async (payerPrivatekey: string, toPublicKay: string, amount: number) => {
     try {
          // Get keypair from payer's private key
          const payer = getSolanaKeypair(payerPrivatekey);

          // Convert toPublicKey into appropriate format
          const toPubKey = new PublicKey(toPublicKay);

          // Convert amount in lamports
          const lamportsToSend = amount * LAMPORTS_PER_SOL;

          // Create transaction
          const transferTx = new Transaction();

          // Add transfer instruction
          transferTx.add(
               SystemProgram.transfer({
                    fromPubkey: payer.publicKey,
                    toPubkey: toPubKey,
                    lamports: lamportsToSend
               })
          )

          // Attach recent blockhash to transaction
          transferTx.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed")).blockhash;

          // Send transaction and wait for confirmation
          const signature = await sendAndConfirmTransaction(solConnection, transferTx, [payer]);
          return signature;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signature = await transferSol("8feb6e8a7ffd25d47f402b39a6c39efec6209908b98b87d4f6438d901fa2fbee361e8eb551f930f784ae951b15c7f39232f78e00d38da2acbb63c445aef48df3", "9nbDpMVp8T1ZHTHSb6m6ACEYi6AaP9NZMjoQkJQbNSTt", 0.1);
          console.log("Signature: ", signature);
     } catch (err) {
          console.log("Error: ", err);
     }
}

main();