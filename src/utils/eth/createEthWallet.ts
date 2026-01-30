import * as bip39 from 'bip39';
import { HDNodeWallet } from "ethers";
import type { Wallet } from '../../slices/appSlice';

export const createEthWallet = (mnemonic: string, walletIdx: number = 0): Wallet => {
     if (!bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid mnemonic");
     }

     try {
          const path = `m/44'/60'/0'/0/${walletIdx}`;
          const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);

          return {
               walletIdx,
               type: "ETH",
               address: wallet.address,
               privateKey: wallet.privateKey,
               path: path
          }
     } catch (err: any) {
          throw err;
     }
}