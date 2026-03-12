import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";
import { ACCOUNT_SIZE, createInitializeAccountInstruction, getMinimumBalanceForRentExemptAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const createTokenAccount = async (payerPrivateKey: string, mintAddress: string) => {
     try {
          const payer = getSolanaKeypair(payerPrivateKey);

          // Generate keypair to use as address of token account
          const tokenAccount = Keypair.generate();

          // Get min balance for rent exemption for token account
          const tokenAccountRent = await getMinimumBalanceForRentExemptAccount(solConnection);

          // Create token account instruction
          const createTokenAccountInstruction = SystemProgram.createAccount({
               fromPubkey: payer.publicKey,
               newAccountPubkey: tokenAccount.publicKey,
               space: ACCOUNT_SIZE,
               lamports: tokenAccountRent,
               programId: TOKEN_PROGRAM_ID
          });

          // Initialize token account instruction
          const initializeTokenAccountInstruction = createInitializeAccountInstruction(
               tokenAccount.publicKey,       // Token account
               new PublicKey(mintAddress),   // Mint public key
               payer.publicKey,              // Owner wallet public key
               TOKEN_PROGRAM_ID
          );

          const transaction = new Transaction().add(
               createTokenAccountInstruction,
               initializeTokenAccountInstruction
          );

          transaction.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed")).blockhash;

          const signature = await sendAndConfirmTransaction(
               solConnection,
               transaction,
               [payer, tokenAccount]
          )

          return signature;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signature = await createTokenAccount("", "");
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();