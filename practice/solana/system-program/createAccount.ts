import { Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";

export const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const createAccount = async (payerPrivatekey: string) => {
     try {
          // Get keypair from payer's private key
          const payer = getSolanaKeypair(payerPrivatekey);

          // Generate new keypair for new account 
          const newAccount = Keypair.generate();

          // Create transaction
          const fundTx = new Transaction();

          //  Add instruction for fund new account
          fundTx.add(
               SystemProgram.createAccount({
                    fromPubkey: payer.publicKey,
                    newAccountPubkey: newAccount.publicKey,
                    lamports: 0.1 * LAMPORTS_PER_SOL,
                    // lamports: 8900,
                    space: 0,
                    programId: SystemProgram.programId
               })
          );

          // Attach recent blockhash to transaction
          fundTx.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed")).blockhash

          // Send transaction and wait for confirmation 
          const signature = await sendAndConfirmTransaction(solConnection, fundTx, [payer, newAccount]);
          return signature;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signature = await createAccount("");
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();