import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import slip10 from 'micro-key-producer/slip10.js';
import type { Wallet } from '../../slices/appSlice';

export const createSolWallet = (mnemonic: string, walletIdx: number = 0): Wallet => {
     if (!bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid mnemonic");
     }

     try {
          const seed = bip39.mnemonicToSeedSync(mnemonic);
          const master = slip10.fromMasterSeed(seed);
          const path = `m/44'/501'/${walletIdx}'/0'`;
          const child = master.derive(path);
          const keyPair = Keypair.fromSeed(child.privateKey);

          return {
               walletIdx,
               type: "SOL",
               address: keyPair.publicKey.toBase58(),
               privateKey: Buffer.from(keyPair.secretKey).toString("hex"),
               path
          }
     } catch (err: any) {
          throw err;
     }
}