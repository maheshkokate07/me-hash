import { Connection, PublicKey } from "@solana/web3.js";

const solConnection = new Connection("https://api.devnet.solana.com", "confirmed");

export const getSignatures = async (address: string) => {
     try {
          const pubKey = new PublicKey(address);
          const signatures = await solConnection.getSignaturesForAddress(pubKey, {
               // limit: 10,
               // before: "5Udt12EC5RwJU8XwgWa8GkZ1HxfvegZiRUEwXCE4qtTjr35AkuRSwWFaeFmhF8JvMdKu3UFL9nvatnGCjkGTJpv3"
          });
          return signatures;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const signatures = await getSignatures("Br9vo46ZHockn1EvWSrHxyjDxkrSgxUEXfxr4XrGzpMU");
          console.log("Signatures: ", signatures);
     } catch (err) {
          console.log("Error: ", err);
     }
}

main();