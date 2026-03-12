import { Connection, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const createATA = async (payerPrivateKey: string, mintAddress: string) => {
     try {
          const payer = getSolanaKeypair(payerPrivateKey);

          // Get a associated token address for specific wallet and mint
          const associatedTokenAccount = getAssociatedTokenAddressSync(
               new PublicKey(mintAddress),   // Mint address
               payer.publicKey,              // Wallet address for ATA
               false,                        // allowOwnerOffCurve
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID
          );

          // Create associated token account instruction
          const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
               payer.publicKey,              // Fee Payer
               associatedTokenAccount,       // Associated Token Account Address
               payer.publicKey,              // Owner
               new PublicKey(mintAddress),   // Mint address
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID
          );

          const transaction = new Transaction().add(createAssociatedTokenAccountIx);

          transaction.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed")).blockhash;

          const signature = await sendAndConfirmTransaction(
               solConnection,
               transaction,
               [payer]
          );

          return { signature, ata: associatedTokenAccount.toBase58() };
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const { signature, ata } = await createATA("", "");
          console.log("Signature: ", signature);
          console.log("ATA: ", ata);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();