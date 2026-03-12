import { getSolanaKeypair } from "../utils/getSolanaKeypair.ts";
import {
     Connection,
     Keypair,
     sendAndConfirmTransaction,
     SystemProgram,
     Transaction
} from "@solana/web3.js";
import {
     createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID
} from '@solana/spl-token';

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const createTokenMint = async (payerPrivateKey: string) => {
     try {
          // Get keypair from payer's private key
          const payer = getSolanaKeypair(payerPrivateKey);

          // Generate keypair for token's mint account - used as address of mint
          const mint = Keypair.generate();

          // Instruction for create account with owner as token program
          const createAccountInstruction = SystemProgram.createAccount({
               fromPubkey: payer.publicKey,
               newAccountPubkey: mint.publicKey,
               space: MINT_SIZE,
               lamports: await getMinimumBalanceForRentExemptMint(solConnection),
               programId: TOKEN_PROGRAM_ID
          });

          // Instruction for Initialize the mint
          const initializeMintInstruction = createInitializeMintInstruction(
               mint.publicKey,
               2,                       // Decimals
               payer.publicKey,         // Mint authority
               payer.publicKey,         // Freeze authority
               TOKEN_PROGRAM_ID
          );

          const transaction = new Transaction().add(
               createAccountInstruction,
               initializeMintInstruction
          );

          // Attach recent blockhash to transaction
          transaction.recentBlockhash = (await solConnection.getLatestBlockhash("confirmed"))
               .blockhash

          const signature = await sendAndConfirmTransaction(
               solConnection,
               transaction,
               [payer, mint]
          );
          return { signature, mint: mint.publicKey.toBase58() };
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const { signature, mint } = await createTokenMint("");
          console.log("Signature: ", signature);
          console.log("Mint: ", mint);
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();