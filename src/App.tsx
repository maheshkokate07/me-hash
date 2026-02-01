import { useState } from "react";
import { useAppSelector } from "./store/hooks";
import { AddAccountDialog } from "./components/custom/AddAccountDialog";
import Header from "./components/custom/Header";
import Onboarding from "./components/custom/Onboarding";
import AddWalletDialog from "./components/custom/AddWalletDialog";
import EmptyAccount from "./components/custom/EmptyAccount";
import Wallet from "./components/custom/Wallet";
import WalletInfoDialog from "./components/custom/WalletInfoDialog";
import ReceiveDialog from "./components/custom/ReceiveDialog";
import RemoveAccountDialog from "./components/custom/RemoveAccountDialog";
import { toast } from "sonner";
import Footer from "./components/custom/Footer";

const headerHeight = "64px";
const footerHeight = "56px";

export default function App() {
  const { activeAccountIdx, accounts, activeWalletType, activeWalletIdx } = useAppSelector((state) => state.app);

  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const [updateOnly, setUpdateOnly] = useState(false);
  const [recoverOnly, setRecoverOnly] = useState(false);
  const [showMnemonicOnly, setShowMnemonicOnly] = useState(false);

  const [addWalletOpen, setAddWalletOpen] = useState(false);
  const [walletInfoOpen, setWalletInfoOpen] = useState(false);

  const [receiveOpen, setReceiveOpen] = useState(false);

  const [removeAccountOpen, setRemoveAccountOpen] = useState(false);

  const openAddAccount = () => {
    setUpdateOnly(false);
    setRecoverOnly(false);
    setShowMnemonicOnly(false);
    setAddAccountOpen(true);
  }

  const openUpdateAccount = () => {
    setUpdateOnly(true);
    setRecoverOnly(false);
    setShowMnemonicOnly(false);
    setAddAccountOpen(true);
  }

  const openRecoverAccount = () => {
    setUpdateOnly(false);
    setRecoverOnly(true);
    setShowMnemonicOnly(false);
    setAddAccountOpen(true);
  }

  const openShowMnemonic = () => {
    setRecoverOnly(true);
    setUpdateOnly(false);
    setShowMnemonicOnly(true);
    setAddAccountOpen(true);
  }

  const openAddWallet = () => setAddWalletOpen(true);
  const openWalletInfo = () => setWalletInfoOpen(true);
  const openReceive = () => setReceiveOpen(true);
  const openSend = () => toast.warning("Coming soon...");

  const openRemoveAccount = () => setRemoveAccountOpen(true);

  if (accounts.length === 0) return <Onboarding footerHeight={footerHeight} />

  const activeAccount = accounts?.find((a) => a.accountIdx === activeAccountIdx);

  const activeWallet: any =
    activeAccount &&
    (activeWalletType === "ETH"
      ? activeAccount.ethWallets.find((w) => w.walletIdx === activeWalletIdx)
      : activeAccount.solWallets.find((w) => w.walletIdx === activeWalletIdx));


  return (
    <div className="min-h-screen flex flex-col">
      <Header headerHeight={headerHeight} openAddAccount={openAddAccount} openUpdateAccount={openUpdateAccount} openRecoverAccount={openRecoverAccount} openShowMnemonic={openShowMnemonic} openRemoveAccount={openRemoveAccount} openAddWallet={openAddWallet} />

      <div className="flex-1" style={{ paddingTop: headerHeight }}>
        {
          activeAccount && activeWalletIdx === -1 ?
            <EmptyAccount headerHeight={headerHeight} footerHeight={footerHeight} activeWalletType={activeWalletType} openAddWallet={openAddWallet} /> :
            <Wallet wallet={activeWallet} onManage={openWalletInfo} onSend={openSend} onReceive={openReceive} />
        }
      </div>

      <Footer footerHeight={footerHeight} position="left" />

      <AddAccountDialog
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        updateOnly={updateOnly}
        recoverOnly={recoverOnly}
        showMnemonicOnly={showMnemonicOnly}
        accountMnemonic={showMnemonicOnly ? activeAccount?.mnemonic : undefined}
        accountIdx={(recoverOnly || updateOnly) ? activeAccountIdx : undefined}
        accountName={activeAccount?.name}
      />

      <AddWalletDialog
        open={addWalletOpen}
        onOpenChange={setAddWalletOpen}
        walletType={activeWalletType}
        accountIdx={activeAccountIdx}
      />

      {
        activeAccount &&
        <RemoveAccountDialog
          open={removeAccountOpen}
          onOpenChange={setRemoveAccountOpen}
          activeAccount={activeAccount}
          onShowMnemonic={openShowMnemonic}
        />
      }

      {
        activeWallet &&
        <>
          <WalletInfoDialog
            wallet={activeWallet}
            open={walletInfoOpen}
            onOpenChange={setWalletInfoOpen}
          />

          <ReceiveDialog
            wallet={activeWallet}
            open={receiveOpen}
            onOpenChange={setReceiveOpen}
          />
        </>
      }
    </div>
  );
}