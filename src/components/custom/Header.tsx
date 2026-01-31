// import { Copy } from "lucide-react";
// import { Button } from "../ui/button";
// import { AccountDropdown } from "./AccountDropdown";
// import { ChainDropdown } from "./ChainDrodown";
// import { WalletDropdown } from "./WalletDropdown";
// import { useAppSelector } from "@/store/hooks";
// import type { Wallet } from "@/slices/appSlice";
// import { toast } from "sonner";
// import { ThemeToggle } from "./ThemeToggle";

// export default function Header({
//      openAddAccount,
//      openUpdateAccount,
//      openRecoverAccount,
//      openShowMnemonic,
//      openRemoveAccount,
//      openAddWallet
// }: {
//      openAddAccount: () => void,
//      openUpdateAccount: () => void,
//      openRecoverAccount: () => void,
//      openShowMnemonic: () => void,
//      openRemoveAccount: () => void,
//      openAddWallet: () => void
// }) {

//      const { activeAccountIdx, accounts, activeWalletIdx, activeWalletType } = useAppSelector((state) => state.app);

//      const activeAccount = accounts.find(a => a.accountIdx === activeAccountIdx);
//      const { solWallets = [], ethWallets = [] } = activeAccount ?? {};

//      const activeWallet: Wallet | undefined =
//           activeWalletType === "ETH"
//                ? ethWallets.find((w: Wallet) => w.walletIdx === activeWalletIdx)
//                : solWallets.find((w: Wallet) => w.walletIdx === activeWalletIdx);

//      const copyCurrentAddress = () => {
//           if (activeWallet?.address) {
//                navigator.clipboard.writeText(activeWallet.address);
//                toast.success("Copied.");
//           }
//      }

//      return (
//           <header className=" w-full bg-white top-0 z-50 border-b border-gray-200 flex items-center gap-2 sm:gap-4 px-5 justify-between" style={{ height: '64px' }}>
//                <div className="flex flex-1 items-center justify-start gap-4 h-full">
//                     <h1 className="text-2xl font-bold select-none hidden sm:block">MeHash</h1>

//                     <div className="border-r h-full hidden sm:block">
//                     </div>

//                     <AccountDropdown onAddAccount={openAddAccount} onUpdateAccount={openUpdateAccount} onRecoverAccount={openRecoverAccount} onShowMnemonic={openShowMnemonic} onRemoveAccount={openRemoveAccount} />
//                </div>

//                <div>
//                     <div className="flex bg-gray-100 overflow-hidden rounded-full border h-10">
//                          <div className="flex items-center justify-center w-full h-full">
//                               <ChainDropdown />
//                          </div>
//                          <div className="border-l border-r flex items-center justify-center w-full h-full">
//                               <WalletDropdown onAddWallet={openAddWallet} />
//                          </div>
//                          <div className="flex items-center justify-center w-full h-full">
//                               <Button
//                                    variant="ghost"
//                                    disabled={!activeWallet}
//                                    onClick={copyCurrentAddress}
//                                    className="h-full px-3 rounded-none flex items-center cursor-pointer hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
//                               >
//                                    <span className="h-6 flex items-center justify-center gap-1.5">
//                                         <Copy className="text-gray-500" />
//                                    </span>
//                               </Button>
//                          </div>
//                     </div>
//                </div>

//                <div className="flex items-center justify-end gap-2.5 flex-1 h-10">
//                     <ThemeToggle />
//                </div>

//           </header>
//      )
// }





import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { AccountDropdown } from "./AccountDropdown";
import { ChainDropdown } from "./ChainDrodown";
import { WalletDropdown } from "./WalletDropdown";
import { useAppSelector } from "@/store/hooks";
import type { Wallet } from "@/slices/appSlice";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

export default function Header({
     openAddAccount,
     openUpdateAccount,
     openRecoverAccount,
     openShowMnemonic,
     openRemoveAccount,
     openAddWallet,
}: {
     openAddAccount: () => void;
     openUpdateAccount: () => void;
     openRecoverAccount: () => void;
     openShowMnemonic: () => void;
     openRemoveAccount: () => void;
     openAddWallet: () => void;
}) {
     const { activeAccountIdx, accounts, activeWalletIdx, activeWalletType } =
          useAppSelector((state) => state.app);

     const activeAccount = accounts.find(
          (a) => a.accountIdx === activeAccountIdx
     );

     const { solWallets = [], ethWallets = [] } = activeAccount ?? {};

     const activeWallet: Wallet | undefined =
          activeWalletType === "ETH"
               ? ethWallets.find((w: Wallet) => w.walletIdx === activeWalletIdx)
               : solWallets.find((w: Wallet) => w.walletIdx === activeWalletIdx);

     const copyCurrentAddress = () => {
          if (activeWallet?.address) {
               navigator.clipboard.writeText(activeWallet.address);
               toast.success("Copied.");
          }
     };

     return (
          <header
               className="w-full bg-background border-b border-border flex items-center gap-2 sm:gap-4 px-5 justify-between"
               style={{ height: "64px" }}
          >
               {/* Left */}
               <div className="flex flex-1 items-center justify-start gap-4 h-full">
                    <h1 className="text-2xl font-bold select-none hidden sm:block text-foreground">
                         MeHash
                    </h1>

                    <div className="border-r border-border h-full hidden sm:block" />

                    <AccountDropdown
                         onAddAccount={openAddAccount}
                         onUpdateAccount={openUpdateAccount}
                         onRecoverAccount={openRecoverAccount}
                         onShowMnemonic={openShowMnemonic}
                         onRemoveAccount={openRemoveAccount}
                    />
               </div>

               {/* Center pill */}
               <div>
                    <div className="flex bg-muted overflow-hidden rounded-full border border-border h-10">
                         <div className="flex items-center justify-center w-full h-full">
                              <ChainDropdown />
                         </div>

                         <div className="border-l border-r border-border flex items-center justify-center w-full h-full">
                              <WalletDropdown onAddWallet={openAddWallet} />
                         </div>

                         <div className="flex items-center justify-center w-full h-full">
                              <Button
                                   variant="ghost"
                                   disabled={!activeWallet}
                                   onClick={copyCurrentAddress}
                                   className="h-full px-3 rounded-none flex items-center cursor-pointer hover:bg-accent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              >
                                   <span className="h-6 flex items-center justify-center gap-1.5">
                                        <Copy className="text-muted-foreground" />
                                   </span>
                              </Button>
                         </div>
                    </div>
               </div>

               {/* Right */}
               <div className="flex items-center justify-end gap-2.5 flex-1 h-10">
                    <ThemeToggle />
               </div>
          </header>
     );
}