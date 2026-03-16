import { createEthWallet } from '../eth/createEthWallet';
import { createSolWallet } from '../sol/createSolWallet';
import { PublicKey } from '@solana/web3.js';
import type { networkType, Wallet } from '../../slices/appSlice';
import { ethers } from "ethers";
import { getTokenPrice } from '../price/getTokenPrice';
import { getSolSignatures } from '../sol/getSolSignatures';
import { getEthConnection } from '../eth/getEthConnection';
import { getSolConnection } from '../sol/getSolConnection';
import { getEthSignatures } from '../eth/getEthSignatures';

const GAP_LIMIT = 3;
const MAX_ACCOUNTS = 20;

export const importWalletsByMnemonic = async (
     mnemonic: string,
     activeNetwork: networkType
) => {
     // Connections
     const ethConnection = getEthConnection(activeNetwork);
     const solConnection = getSolConnection(activeNetwork);

     // FOR ETH
     const ethWallets: Wallet[] = [];
     let zeroEth: number = 0;
     const ethPriceUsd = await getTokenPrice("ETH", "usd");

     for (let i = 0; i < MAX_ACCOUNTS && zeroEth < GAP_LIMIT; i++) {
          try {
               const wallet = createEthWallet(mnemonic, i);
               const balanceWei = await ethConnection.getBalance(wallet.address);

               if (balanceWei !== 0n) {
                    const balanceEth = Number(ethers.formatEther(balanceWei));
                    wallet[activeNetwork].balance = balanceEth;
                    try {
                         wallet[activeNetwork].signatures = await getEthSignatures(wallet.address, activeNetwork);
                    } catch (err) {
                         wallet[activeNetwork].signatures = [];
                    }
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
     const solPriceUsd = await getTokenPrice("SOL", "usd");

     for (let i = 0; i < MAX_ACCOUNTS && zeroSol < GAP_LIMIT; i++) {
          try {
               const wallet = createSolWallet(mnemonic, i);
               const pubKey = new PublicKey(wallet.address);
               const balanceLamports = await solConnection.getBalance(pubKey);

               if (balanceLamports !== 0) {
                    const balanceSol = balanceLamports / 1e9;
                    wallet[activeNetwork].balance = balanceSol;
                    try {
                         wallet[activeNetwork].signatures = await getSolSignatures(wallet.address, activeNetwork);
                    } catch (err) {
                         wallet[activeNetwork].signatures = [];
                    }
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

     return { ethWallets, solWallets, ethPriceUsd, solPriceUsd };
};