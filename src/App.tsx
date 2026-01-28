import * as bip39 from 'bip39';
import { useEffect, useState } from 'react';
import { createEthWallet } from './utils/eth/createEthWallet';
import { createSolWallet } from './utils/sol/createSolWallet';
import { importWalletsByMnemonic } from './utils/wallets/importByMnumonic';

function App() {

  const [mnemonic, setMnemonic] = useState<any>("");
  const [ethIdx, setEthIdx] = useState(0);
  const [solIdx, setSolIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const createEthAccount = () => {
    if (!mnemonic) {
      alert("Seed phrase is required to create account!");
      return;
    }

    const wallet = createEthWallet(mnemonic, ethIdx);
    setEthIdx(prev => prev + 1);
    console.log(`ETH wallet - ${ethIdx}: ${JSON.stringify(wallet)}`);
  }

  const createSolAccount = () => {
    if (!mnemonic) {
      alert("Seed phrase is required to create account!");
      return;
    }

    const wallet = createSolWallet(mnemonic, solIdx);
    setSolIdx(prev => prev + 1);
    console.log(`SOL wallet - ${solIdx}: ${JSON.stringify(wallet)}`);
  }

  const recoverAccounts = async () => {
    if (!mnemonic) {
      alert("Seed phrase is required to recover accounts!");
      return;
    }

    setLoading(true);
    try {
      const wallets = await importWalletsByMnemonic(mnemonic);
      console.log(wallets);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const mnemonic = bip39.generateMnemonic(128);
    setMnemonic(mnemonic);
  }, [])

  useEffect(() => {
    if (mnemonic) {
      console.log("mnemonic => ", mnemonic)
    }
  }, [mnemonic])

  return (
    <div className='max-w-7xl p-6 flex items-center gap-5'>
      {loading && <>Loading...</>}
      <button className='border px-3 py-2 rounded-md cursor-pointer' onClick={createEthAccount}>Create ETH Account</button>
      <button className='border px-3 py-2 rounded-md cursor-pointer' onClick={createSolAccount}>Create SOL Account</button>
      <input type="text" value={mnemonic} onChange={(e) => setMnemonic(e.target.value)} className='border px-3 py-2 rounded-md w-100' />
      <button className='border px-3 py-2 rounded-md cursor-pointer' onClick={recoverAccounts}>Recover Accounts</button>
    </div>
  )
}

export default App;