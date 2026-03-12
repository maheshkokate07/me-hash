import { Connection, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";
import {
     ASSOCIATED_TOKEN_PROGRAM_ID,
     createTransferInstruction,
     getAssociatedTokenAddressSync,
     TOKEN_PROGRAM_ID
} from "@solana/spl-token";

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const transferTokens = async (
     payerPrivateKey: string,
     receiverPublicKey: string,
     mintAddress: string,
     amount: number
) => {
     try {
          const payer = getSolanaKeypair(payerPrivateKey);

          // Get associated token address for payer
          const payerATA = getAssociatedTokenAddressSync(
               new PublicKey(mintAddress),
               payer.publicKey,
               false,
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID
          );

          // Get associated token address for receiver
          const receiverATA = getAssociatedTokenAddressSync(
               new PublicKey(mintAddress),
               new PublicKey(receiverPublicKey),
               false,
               TOKEN_PROGRAM_ID,
               ASSOCIATED_TOKEN_PROGRAM_ID
          );

          // Transfer instruction
          const transferInstruction = createTransferInstruction(
               payerATA,           // Source ATA
               receiverATA,        // Destination ATA
               payer.publicKey,    // Owner of payer ATA
               amount,             // Amount in smallest unit
               [],                 // Multi-Signers
               TOKEN_PROGRAM_ID
          );

          const transferTx = new Transaction().add(transferInstruction);

          transferTx.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed")).blockhash;

          const signature = await sendAndConfirmTransaction(
               solConnection,
               transferTx,
               [payer]
          );
          return signature;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signature = await transferTokens("", "", "", 110);
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();