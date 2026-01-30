import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { AccountDropdown } from "./AccountDropdown";
import { ChainDropdown } from "./ChainDrodown";
import { WalletDropdown } from "./WalletDropdown";
import { useAppSelector } from "@/store/hooks";
import type { Wallet } from "@/slices/appSlice";

export default function Header({ openAddAccount, openAddWallet }: { openAddAccount: () => void, openAddWallet: () => void }) {

     const { activeAccountIdx, accounts, activeWalletIdx, activeWalletType } = useAppSelector((state) => state.app);

     const activeAccount = accounts.find(a => a.accountIdx === activeAccountIdx);
     const { solWallets = [], ethWallets = [] } = activeAccount ?? {};

     const activeWallet: Wallet | undefined =
          activeWalletType === "ETH"
               ? ethWallets.find((w: Wallet) => w.walletIdx === activeWalletIdx)
               : solWallets.find((w: Wallet) => w.walletIdx === activeWalletIdx);

     const copyCurrentAddress = () => {
          if (activeWallet?.address) {
               navigator.clipboard.writeText(activeWallet.address);
               alert("Wallet address copied!");
          }
     }

     return (
          <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between">
               <div className="flex flex-1 items-center gap-4 h-full">
                    <h1 className="text-2xl font-bold select-none">MeHash</h1>

                    <div className="border-r h-full">
                    </div>

                    <AccountDropdown onAddAccount={openAddAccount} />
               </div>

               <div>
                    <div className="flex bg-gray-100 overflow-hidden rounded-full border h-10">
                         <div className="flex items-center justify-center w-full h-full">
                              <ChainDropdown />
                         </div>
                         <div className="border-l border-r flex items-center justify-center w-full h-full">
                              <WalletDropdown onAddWallet={openAddWallet} />
                         </div>
                         <div className="flex items-center justify-center w-full h-full">
                              <Button
                                   variant="ghost"
                                   disabled={!activeWallet}
                                   onClick={copyCurrentAddress}
                                   className="h-full px-3 rounded-none flex items-center cursor-pointer hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              >
                                   <span className="h-6 flex items-center justify-center gap-1.5">
                                        <Copy className="text-gray-500" />
                                   </span>
                              </Button>
                         </div>
                    </div>
               </div>

               <div className="flex-1">

               </div>
          </header>
     )
}