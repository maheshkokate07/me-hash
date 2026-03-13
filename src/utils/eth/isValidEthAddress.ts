import { ethers } from "ethers"

export const isValidEthAddress = (address: string) => {
     return ethers.isAddress(address);
}