import { ethers, type Wallet } from 'ethers';

export const getEthereumWallet = (privateKey: string): Wallet => {
     try {
          return new ethers.Wallet(privateKey);
     } catch (err) {
          throw new Error("Invalid Ethereum private key");
     }
}