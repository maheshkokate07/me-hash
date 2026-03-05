import { Keypair } from '@solana/web3.js';

export const getSolanaKeypair = (privateKey: string): Keypair => {
     try {
          const secretKey = Uint8Array.from(
               Buffer.from(privateKey, 'hex')
          );
          
          return Keypair.fromSecretKey(secretKey);
     } catch {
          throw new Error("Invalid Solana private key");
     }
}