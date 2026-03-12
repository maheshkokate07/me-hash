import { ethers } from "ethers";
import { getEthereumWallet } from "./utils/getEthereumWallet.ts";

export const ethConnection = new ethers.JsonRpcProvider("");

export const sendEthTransaction = async (
    payerPrivatekey: string,
    toPublicKay: string,
    amount: number,
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

        // Send transaction
        const transaction = await wallet.sendTransaction(tx);

        return transaction.hash;
    } catch (err) {
        throw err;
    }
}

export const confirmEthTransaction = async (txHash: string) => {
    try {
        // Wait for transaction confirmation
        const receipt = await ethConnection.waitForTransaction(txHash)
        return receipt;
    } catch (err) {
        throw err;
    }
}

const main = async () => {
    try {
        const signature = await sendEthTransaction(
            "",
            "",
            0.001,
        );
        console.log("Tx sent: ", signature);

        const receipt = await confirmEthTransaction(signature);
        console.log("Tx confirmed: ", receipt);
    } catch (err) {
        console.log("Error: ", err);
    }
}

main();