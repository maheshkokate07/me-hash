import { ethers } from "ethers";
import { getEthereumWallet } from "./utils/getEthereumWallet.ts";

export const ethConnection = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/1d7ad012aa924b439042cb9256b5890c");

export const transferEth = async (
    payerPrivatekey: string,
    toPublicKay: string,
    amount: number
) => {
    try {
        // Get Ethereum wallet from payer's private key
        const wallet = getEthereumWallet(payerPrivatekey).connect(ethConnection);

        // Get the estimated gas required for the tx to set the gas limit
        const estimatedGas = await wallet.estimateGas({
            to: toPublicKay,
            value: ethers.parseEther(amount.toString())
        });

        // Build transaction
        const tx = {
            to: toPublicKay,
            value: ethers.parseEther(amount.toString()),
            gasLimit: estimatedGas
        }

        // Sent transaction
        const transaction = await wallet.sendTransaction(tx);

        // Wait for transaction confirmation
        await transaction.wait();

        return transaction.hash;
    } catch (err) {
        throw err;
    }
}

const main = async () => {
    try {
        const signature = await transferEth("0x13be8eb9baa781f768453102f5f1a2e5b37e7544f3efca6da7a99bdb13e3ed5c", "0x0e0f2638bB4cECe3B8beBe92C362b71C9DeB90E9", 0.001);
        console.log("Signature: ", signature);
    } catch (err) {
        console.log("Error: ", err);
    }
}

main();