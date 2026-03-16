import { ethers } from "ethers";
import { getEthereumWallet } from "./getEthereumWallet.ts";
import { getEthConnection } from "./getEthConnection.ts";
import type { networkType } from "@/slices/appSlice.ts";

export const sendEthTransaction = async (
     payerPrivatekey: string,
     toPublicKay: string,
     amount: string,
     activeNetwork: networkType
) => {
     try {
          const ethConnection = getEthConnection(activeNetwork);

          // Get Ethereum wallet from payer's private key
          const wallet = getEthereumWallet(payerPrivatekey).connect(ethConnection);

          // Convert amount to wei
          const value = ethers.parseEther(amount);

          // Get the estimated gas required for the tx to set the gas limit
          const estimatedGas = await wallet.estimateGas({
               to: toPublicKay,
               value
          });

          // Get current fee data
          const feeData = await ethConnection.getFeeData();
          const maxFeePerGas = feeData.maxFeePerGas!;

          // Total estimated fee (in wei)
          const estimatedFee = estimatedGas * maxFeePerGas;

          // Total amount deducted = amount sent + estimated fee
          const totalDeductedWei = value + estimatedFee;

          // Convert to ETH
          const totalDeductedEth = Number(ethers.formatEther(totalDeductedWei));

          // Build transaction
          const tx = {
               to: toPublicKay,
               value,
               gasLimit: estimatedGas
          }

          // Send transaction
          const transaction = await wallet.sendTransaction(tx);

          return { signature: transaction.hash, totalDeductedEth };
     } catch (err) {
          throw err;
     }
}

export const confirmEthTransaction = async (txHash: string, activeNetwork: networkType) => {
     try {
          const ethConnection = getEthConnection(activeNetwork);

          // Wait for transaction confirmation
          const receipt = await ethConnection.waitForTransaction(txHash)

          return {
               signature: receipt?.hash,
               slot: Number(receipt?.blockNumber),
               blockTime: null,
               confirmationStatus: receipt?.status === 1 ? "confirmed" : "failed",
          }
     } catch (err) {
          throw err;
     }
}