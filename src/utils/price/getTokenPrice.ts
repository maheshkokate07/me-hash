import axios from "axios";

export async function getTokenPrice(
     tokenSymbol: 'ETH' | 'SOL',
     currency: string = 'usd'
): Promise<number> {
     try {
          const idMap: Record<string, string> = {
               ETH: "ethereum",
               SOL: "solana",
          };

          const id = idMap[tokenSymbol.toUpperCase()];
          if (!id) throw new Error(`Token ${tokenSymbol} not supported`);

          const res = await axios.get(
               `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${currency.toLowerCase()}`
          );

          return res.data[id]?.[currency.toLowerCase()] ?? 0;
     } catch (err) {
          console.error(`Failed to get ${tokenSymbol} price in ${currency}`, err);
          return 0;
     }
}