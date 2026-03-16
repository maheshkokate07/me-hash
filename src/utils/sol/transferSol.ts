import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { sleep } from '../../../src/utils/time/sleep.ts';
import { getSolanaKeypair } from "./getSolanaKeypair.ts";
import type { networkType } from "@/slices/appSlice.ts";
import { getSolConnection } from "./getSolConnection.ts";
import BigNumber from 'bignumber.js';

export const sendSolTransaction = async (
     payerPrivatekey: string,
     toPublicKay: string,
     amount: string,
     activeNetwork: networkType
) => {
     try {
          const solConnection = getSolConnection(activeNetwork);

          // Get keypair from payer's private key
          const payer = getSolanaKeypair(payerPrivatekey);

          // Convert toPublicKey into appropriate format
          const toPubKey = new PublicKey(toPublicKay);

          // Convert amount in lamports
          // const lamportsToSend = amount * LAMPORTS_PER_SOL;

          const lamportsBN = new BigNumber(amount).multipliedBy(LAMPORTS_PER_SOL);
          const lamportsToSend = BigInt(lamportsBN.toFixed(0));

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

          transferTx.feePayer = payer.publicKey;

          // Estimate fee
          const fee = (await solConnection.getFeeForMessage(transferTx.compileMessage())).value!;
          const feeSol = fee / LAMPORTS_PER_SOL;

          const totalDeductedSol = new BigNumber(amount)
               .plus(feeSol)
               .toFixed(9);

          // Send transaction
          const signature = await solConnection.sendTransaction(transferTx, [payer]);

          return { signature, totalDeductedSol: Number(totalDeductedSol) };
     } catch (err) {
          throw err;
     }
}

export const confirmSolTransaction = async (signature: string, activeNetwork: networkType) => {
     try {
          const solConnection = getSolConnection(activeNetwork);

          // Wait for transaction confirmation
          let receipt = null;
          while (!receipt) {
               await sleep(1000);
               receipt = await solConnection.getTransaction(signature, {
                    commitment: "confirmed"
               });
          }

          return {
               signature: receipt.transaction.signatures[0],
               slot: Number(receipt.slot),
               blockTime: Number(receipt.blockTime),
               confirmationStatus: receipt.meta?.err ? "failed" : "confirmed"
          }
     } catch (err) {
          throw err;
     }
}