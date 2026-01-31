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

export default function App() {
  const { activeAccountIdx, accounts, activeWalletType, activeWalletIdx } = useAppSelector((state) => state.app);

  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [updateOnly, setUpdateOnly] = useState(false);
  const [recoverOnly, setRecoverOnly] = useState(false);
  const [addWalletOpen, setAddWalletOpen] = useState(false);
  const [walletInfoOpen, setWalletInfoOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);

  const openAddAccount = () => {
    setUpdateOnly(false);
    setRecoverOnly(false);
    setAddAccountOpen(true);
  }
  const openUpdateAccount = () => {
    setUpdateOnly(true);
    setRecoverOnly(false);
    setAddAccountOpen(true);
  }
  const openRecoverAccount = () => {
    setUpdateOnly(false);
    setRecoverOnly(true);
    setAddAccountOpen(true);
  }
  const openAddWallet = () => setAddWalletOpen(true);
  const openWalletInfo = () => setWalletInfoOpen(true);
  const openReceive = () => setReceiveOpen(true);

  if (accounts.length === 0) return <Onboarding />

  const activeAccount = accounts?.find((a) => a.accountIdx === activeAccountIdx);

  const activeWallet: any =
    activeAccount &&
    (activeWalletType === "ETH"
      ? activeAccount.ethWallets.find((w) => w.walletIdx === activeWalletIdx)
      : activeAccount.solWallets.find((w) => w.walletIdx === activeWalletIdx));


  return (
    <div className="h-screen flex flex-col">
      <Header openAddAccount={openAddAccount} openUpdateAccount={openUpdateAccount} openRecoverAccount={openRecoverAccount} openAddWallet={openAddWallet} />

      {
        activeAccount && activeWalletIdx === -1 ?
          <EmptyAccount activeWalletType={activeWalletType} openAddWallet={openAddWallet} /> :
          <Wallet wallet={activeWallet} onManage={openWalletInfo} onReceive={openReceive} />
      }

      <AddAccountDialog
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        updateOnly={updateOnly}
        recoverOnly={recoverOnly}
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