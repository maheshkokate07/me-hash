import { Connection, PublicKey } from "@solana/web3.js";

export const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const isValidAddress = async (publicKey: string) => {
     const pubKey = new PublicKey(publicKey);

     // const minRent = await solConnection.getMinimumBalanceForRentExemption(0);
     // console.log(minRent);

     const account = await solConnection.getAccountInfo(pubKey);
     return account;
}

export const isValidPublicKey = (keyString: string) => {
     try {
          const publicKey = new PublicKey(keyString);
          return PublicKey.isOnCurve(publicKey.toBytes());
     } catch (err) {
          return false;
     }
}

// isValidAddress("HRPMd43wKAHvz1Xo1xS9zeTdYtfTppA9WGqDgizcSiKd");
isValidAddress("Br9vo46ZHockn1EvWSrHxyjDxkrSgxUEXfxr4XrGzpMU");

// console.log(isValidPublicKey("HSb38H8XH4RYfduRjK7ZFPSNKCYQuRAWBF1dS4X6zC9"));