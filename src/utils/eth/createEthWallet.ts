import * as bip39 from 'bip39';
import { HDNodeWallet } from "ethers";

export const createEthWallet = (mnemonic: string, accountIdx: number = 0) => {
     if (!bip39.validateMnemonic(mnemonic)) {
          throw new Error("Invalid mnemonic");
     }

     const path = `m/44'/60'/0'/0/${accountIdx}`;
     const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);

     return {
          accountIdx,
          type: "ETH",
          address: wallet.address,
          privateKey: wallet.privateKey,
          path: path
     }
}