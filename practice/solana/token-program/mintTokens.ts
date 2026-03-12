import { Connection, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";
import { createMintToInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const mintTokens = async (
     mintAuthorityPrivateKey: string,
     mintAddress: string,
     tokenAccountAddress: string
) => {
     try {
          const mintAuthority = getSolanaKeypair(mintAuthorityPrivateKey);

          // Create a mint to instruction
          const mintToInstruction = createMintToInstruction(
               new PublicKey(mintAddress),             // Mint address
               new PublicKey(tokenAccountAddress),     // Destination address
               mintAuthority.publicKey,                // Mint authority
               250,                                    // Amount in smallest unit
               [],                                     // Multi-Signers
               TOKEN_PROGRAM_ID                        // Program ID
          )

          const transaction = new Transaction().add(mintToInstruction);

          transaction.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed")).blockhash;

          const signature = await sendAndConfirmTransaction(
               solConnection,
               transaction,
               [mintAuthority]
          );

          return signature;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signature = await mintTokens("", "", "");
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main()