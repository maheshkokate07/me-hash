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
          const signature = await mintTokens("8feb6e8a7ffd25d47f402b39a6c39efec6209908b98b87d4f6438d901fa2fbee361e8eb551f930f784ae951b15c7f39232f78e00d38da2acbb63c445aef48df3", "EQ7BsKyJizYRyuok7Zwjk9eEoADVmiTJczmF8sEXxAnH", "DcWZicJcWkJUpSd3GjzmMFx4soSXW7n9GhKVFKStQNJs");
          console.log("Signature: ", signature);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main()