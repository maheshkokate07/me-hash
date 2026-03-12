import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";
import { sleep } from '../../../src/utils/time/sleep.ts';

export const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const sendSolTransaction = async (
     payerPrivatekey: string,
     toPublicKay: string,
     amount: number
) => {
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

          // Get latest blockhash
          const latestBlock = await solConnection.getLatestBlockhash("confirmed");

          // Attach recent blockhash to transaction
          transferTx.recentBlockhash = latestBlock.blockhash;

          // Send transaction
          const signature = await solConnection.sendTransaction(transferTx, [payer]);

          return signature;
     } catch (err) {
          throw err;
     }
}

export const confirmSolTransaction = async (signature: string) => {
     try {
          // Wait for transaction confirmation
          let receipt = null;
          while (!receipt) {
               await sleep(1000);
               receipt = await solConnection.getTransaction(signature, {
                    commitment: "confirmed"
               });
          }
          return receipt;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signature = await sendSolTransaction(
               "8feb6e8a7ffd25d47f402b39a6c39efec6209908b98b87d4f6438d901fa2fbee361e8eb551f930f784ae951b15c7f39232f78e00d38da2acbb63c445aef48df3",
               "9nbDpMVp8T1ZHTHSb6m6ACEYi6AaP9NZMjoQkJQbNSTt",
               0.1
          );
          console.log("Tx sent: ", signature);

          const receipt = await confirmSolTransaction(signature);
          console.log("Tx confirmed: ", receipt);
     } catch (err) {
          console.log("Error: ", err);
     }
}

main();