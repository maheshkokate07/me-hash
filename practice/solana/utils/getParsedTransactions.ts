import { Connection } from "@solana/web3.js";

const solConnection = new Connection("https://solana-devnet.g.alchemy.com/v2/FkBMdsbA442d5NhwxjyRg", "confirmed");

const getParsedTransactions = async (signatures: string[]) => {
     try {
          const data = await solConnection.getParsedTransaction(signatures[0]);
          return data;
     } catch (err) {
          throw err;
     }
}

const main = async () => {
     try {
          const parsedTransactions = await getParsedTransactions([
               "29vQebaB4iRwzi8ewEJvCptK16FxQX8wG5SdojojeS3vAd4np3KXP9aPzytmgD61fujak4PL4LQhR9jkUQwynfmw",
               "29vQebaB4iRwzi8ewEJvCptK16FxQX8wG5SdojojeS3vAd4np3KXP9aPzytmgD61fujak4PL4LQhR9jkUQwynfmw",
               "5MQYTudfEbv9emXkCfdM14ph2AF9J9qkKM3PGsj6VHH1bEznLkz3qMU14Dz6TVTKRvj4pniwnNbBa5vpuuMetjne",
               "2Yq1TYMxNi9rWeMLuYiYbRVvbL7nsRXKFwkrMMCu8NLBsAjFTA1RTijKyM1veqWj1DRP5g3zsGFMbrZBFDGj49R4",
               "HZQ24MPKZSNtXvW8ySh3k4fKkmJiRpNZ88XCa2aRiRWbYsNDGwndpqbR5nViq5Dvb5UdGApxmK1PH19XwiXtsv7",
               "25xSMJwW1KBmcvN9jQnT6yv86JiWytaWQquGdhUNK2mhQmGXQMWbiCnQ6Z99inKER6xNtbhhJjTahNJqHfAyQU5X",
               "2AepVKb6VKA6b98vj1LiGPPiXp8t5RD1zREcgicLhV4sHiEAcimtQqH9LBsaBP3nvmia6oCw443FtWnFwseByaZW"
          ]);
          console.log("Parsed transactions: ", JSON.stringify(parsedTransactions?.transaction));
     } catch (err) {
          console.error("Error: ", err);
     }
}

main();