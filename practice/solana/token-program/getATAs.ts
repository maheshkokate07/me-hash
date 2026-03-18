import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const getATAs = async (walletAddress: string) => {
     try {
          const ownerPublicKey = new PublicKey(walletAddress);

          // Fetch all token accounts owned by this wallet
          const tokenAccounts = await solConnection.getParsedTokenAccountsByOwner(
               ownerPublicKey,
               {
                    programId: TOKEN_PROGRAM_ID,
               }
          );

          return tokenAccounts;
     } catch (err) {
          throw err;
     }
};

const main = async () => {
     try {
          const tokenAccounts = await getATAs("YOUR_WALLET_PUBLIC_KEY");
          console.log("All ATAs: " tokenAccounts);
     } catch (err) {
          console.error("Error: ", err);
     }
};

main();
