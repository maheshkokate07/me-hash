import { createEthWallet } from '../eth/createEthWallet';
import { ethConnection } from '../eth/connection';
import { createSolWallet } from '../sol/createSolWallet';
import { solConnection } from '../sol/connection';
import { PublicKey } from '@solana/web3.js';
import type { Wallet } from '../../slices/appSlice';

const GAP_LIMIT = 3;
const MAX_ACCOUNTS = 20;

export const importWalletsByMnemonic = async (mnemonic: string) => {
     // FOR ETH
     const ethWallets: Wallet[] = [];
     let zeroEth: number = 0;

     for (let i = 0; i < MAX_ACCOUNTS && zeroEth < GAP_LIMIT; i++) {
          try {
               const wallet = createEthWallet(mnemonic, i);
               const balance = await ethConnection.getBalance(wallet.address);

               if (balance !== 0n) {
                    ethWallets.push(wallet);
                    zeroEth = 0;
               } else {
                    zeroEth++;
               }
          } catch (err) {
               console.error(`Error fetching ETH balance for wallet ${i}:`, err);
          }
     }

     if (ethWallets.length === 0) {
          const fallbackWallet = createEthWallet(mnemonic, 0);
          ethWallets.push(fallbackWallet);
     }

     // FOR SOL
     const solWallets: Wallet[] = [];
     let zeroSol: number = 0;

     for (let i = 0; i < MAX_ACCOUNTS && zeroSol < GAP_LIMIT; i++) {
          try {
               const wallet = createSolWallet(mnemonic, i);
               const pubKey = new PublicKey(wallet.address);
               const balance = await solConnection.getBalance(pubKey);

               if (balance !== 0) {
                    solWallets.push(wallet);
                    zeroSol = 0;
               } else {
                    zeroSol++;
               }
          } catch (err) {
               console.error(`Error fetching SOL balance for wallet ${i}:`, err);
          }
     }

     if (solWallets.length === 0) {
          const fallbackWallet = createSolWallet(mnemonic, 0);
          solWallets.push(fallbackWallet);
     }

     return { ethWallets, solWallets };
};