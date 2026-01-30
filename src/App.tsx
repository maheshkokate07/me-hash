import { useState } from "react";
import { addEthWallet, addSolWallet, createAccount, recoverWallets, setActiveAccount, type Wallet } from "./slices/appSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Button } from "./components/ui/button";
import { AccountDropdown } from "./components/custom/AccountDropdown";
import { WalletDropdown } from "./components/custom/WalletDropdown";
import { ChainDropdown } from "./components/custom/ChainDrodown";
import { Copy } from "lucide-react";

export default function App() {
  const { activeAccountIdx, accounts, activeWalletIdx, activeWalletType } = useAppSelector((state) => state.app);

  const dispatch = useAppDispatch();

  const createEthWallet = async () => {
    if (activeAccountIdx === -1) {
      alert("Select an account first");
      return;
    }
    await dispatch(addEthWallet({ accountIdx: activeAccountIdx }));
  };

  const createSolWallet = async () => {
    if (activeAccountIdx === -1) {
      alert("Select an account first");
      return;
    }
    await dispatch(addSolWallet({ accountIdx: activeAccountIdx }));
  };

  const activeAccount = accounts?.find(a => a.accountIdx === activeAccountIdx);
  const { solWallets, ethWallets }: any = activeAccount;

  const activeWallet: Wallet = activeWalletType === 'ETH' ? ethWallets?.find((w: Wallet) => w.walletIdx === activeWalletIdx) : solWallets?.find((w: Wallet) => w.walletIdx === activeWalletIdx);

  const copyCurrentAddress = () => {
    if (activeWallet?.address) {
      navigator.clipboard.writeText(activeWallet.address);
      alert("Wallet address copied!");
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 flex items-center px-6 justify-between">
        {/* Left: App Name + Account Dropdown */}
        <div className="flex items-center gap-4 h-full">
          <h1 className="text-2xl font-bold select-none">MeHash</h1>

          <div className="border-r h-full">
          </div>

          <AccountDropdown />
        </div>

        <div className="flex bg-gray-100 overflow-hidden rounded-full border h-10">
          <div className="flex items-center justify-center w-full h-full">
            <ChainDropdown />
          </div>
          <div className="border-l border-r flex items-center justify-center w-full h-full">
            <WalletDropdown />
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

        <div>
        </div>

      </header>

    </div>
  );
}