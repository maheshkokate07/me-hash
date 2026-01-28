import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import slip10 from 'micro-key-producer/slip10.js';

export const createSolWallet = (mnemonic: string, accountIdx: number = 0) => {
     if (!bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid mnemonic");
     }

     const seed = bip39.mnemonicToSeedSync(mnemonic);
     const master = slip10.fromMasterSeed(seed);
     const path = `m/44'/501'/${accountIdx}'/0'`;
     const child = master.derive(path);
     const keyPair = Keypair.fromSeed(child.privateKey);

     return {
          accountIdx,
          type: "SOL",
          address: keyPair.publicKey.toBase58(),
          privateKey: Buffer.from(keyPair.secretKey).toString("hex"),
          path
     }
}