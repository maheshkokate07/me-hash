import * as bip39 from 'bip39';
import { createEthWallet } from '../eth/createEthWallet';
import { ethConnection } from '../eth/connection';
import { createSolWallet } from '../sol/createSolWallet';
import { solConnection } from '../sol/connection';
import { PublicKey } from '@solana/web3.js';

const GAP_LIMIT = 5;
const MAX_ACCOUNTS = 20;

export const importWalletsByMnemonic = async (mnemonic: string) => {
     if (!bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid mnemonic");
     }

     // FOR ETH
     const ethWallets: any[] = [];
     let zeroEth: number = 0;

     for (let i = 0; i < MAX_ACCOUNTS && zeroEth < GAP_LIMIT; i++) {
          const wallet = createEthWallet(mnemonic, i);
          const balance = await ethConnection.getBalance(wallet.address);

          if (balance !== 0n) {
               ethWallets.push(wallet);
               zeroEth = 0;
          } else {
               zeroEth++;
          }

     }

     if (ethWallets.length === 0) {
          ethWallets.push(createEthWallet(mnemonic, 0));
     }

     // FOR SOL
     const solWallets: any[] = [];
     let zeroSol: number = 0;

     for (let i = 0; i < MAX_ACCOUNTS && zeroSol < GAP_LIMIT; i++) {
          const wallet = createSolWallet(mnemonic, i);
          const pubKey = new PublicKey(wallet.address);
          const balance = await solConnection.getBalance(pubKey);

          if (balance !== 0) {
               solWallets.push(wallet);
               zeroSol = 0;
          } else {
               zeroSol++;
          }

     }

     if (solWallets.length === 0) {
          solWallets.push(createSolWallet(mnemonic, 0));
     }

     return { ethWallets, solWallets };
}