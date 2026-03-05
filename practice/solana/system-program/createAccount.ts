import { Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";

export const solConnection = new Connection("https://solana-devnet.g.alchemy.com/v2/FkBMdsbA442d5NhwxjyRg", "confirmed");

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
          const signature = await createAccount("8feb6e8a7ffd25d47f402b39a6c39efec6209908b98b87d4f6438d901fa2fbee361e8eb551f930f784ae951b15c7f39232f78e00d38da2acbb63c445aef48df3");
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();