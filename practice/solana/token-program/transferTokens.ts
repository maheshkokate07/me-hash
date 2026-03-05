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
          const signature = await transferTokens("274623952d2af09a05e4ba53e42f9cc4941cc5431774f173c390cf3f6415fd050a07b09851a03f88b19dda05a67c701a08c4947482b65a2521ab0bdebe79265f", "FT451WyLdmmWBfrVDD3L7ABbm6XXhb9ope3vhHLG8tcP", "EQ7BsKyJizYRyuok7Zwjk9eEoADVmiTJczmF8sEXxAnH", 110);
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();