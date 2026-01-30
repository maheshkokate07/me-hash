import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as bip39 from 'bip39';
import { createEthWallet } from "../utils/eth/createEthWallet";
import { createSolWallet } from "../utils/sol/createSolWallet";
import { importWalletsByMnemonic } from "../utils/wallets/importByMnumonic";
import { getEthBalance } from "@/utils/eth/getEthBalance";
import { getSolBalance } from "@/utils/sol/getSolBalance";

type walletType = 'SOL' | 'ETH';

export interface Wallet {
    walletIdx: number;
    type: walletType;
    address: string;
    privateKey: string;
    path: string;

    balance: number;
    balanceUsd: number;
    lastUpdated: number;
    // isLoading: boolean;
}

interface Account {
    accountIdx: number;
    name: string;
    mnemonic: string;
    ethWallets: Wallet[];
    solWallets: Wallet[];
    createdAt: number;
}

interface AppState {
    accounts: Account[];
    activeAccountIdx: number;
    activeWalletType: walletType;
    activeWalletIdx: number;
}

const initialState: AppState = {
    accounts: [],
    activeAccountIdx: -1,
    activeWalletType: 'ETH',
    activeWalletIdx: -1
}

export const createAccount = createAsyncThunk(
    "app/createAccount",
    (payload: { name?: string }, { getState }) => {
        const state = getState() as { app: AppState };
        const maxIdx =
            state.app.accounts.length > 0 ?
                Math.max(...state.app.accounts.map(a => a.accountIdx)) :
                -1;

        // const mnemonic = bip39.generateMnemonic(128);

        const newAccount: Account = {
            accountIdx: maxIdx + 1,
            name: payload.name ?? `Account ${maxIdx + 1}`,
            mnemonic: "",
            ethWallets: [],
            solWallets: [],
            createdAt: Date.now()
        }

        return newAccount;
    },
);

export const addEthWallet = createAsyncThunk(
    "app/addEthWallet",
    (payload: { accountIdx: number }, { getState, rejectWithValue }) => {
        const state = getState() as { app: AppState };
        const account = state.app.accounts.find(a => a.accountIdx === payload.accountIdx);

        if (!account) {
            return rejectWithValue("Account not found");
        }

        const mnemonic = !!account.mnemonic ? account.mnemonic : bip39.generateMnemonic(128);

        try {
            const maxWalletIdx = account.ethWallets.length > 0 ? Math.max(...account.ethWallets.map(w => w.walletIdx)) : -1;
            const wallet = createEthWallet(mnemonic, maxWalletIdx + 1);
            return { accountIdx: payload.accountIdx, mnemonic, wallet };
        } catch (err: any) {
            console.error("Error craeting ETH wallet: ", err);
            return rejectWithValue("Failed to create ETH wallet");
        }
    }
);

export const addSolWallet = createAsyncThunk(
    "app/addSolWallet",
    (payload: { accountIdx: number }, { getState, rejectWithValue }) => {
        const state = getState() as { app: AppState };
        const account = state.app.accounts.find(a => a.accountIdx === payload.accountIdx);

        if (!account) {
            return rejectWithValue("Account not found");
        }

        const mnemonic = !!account.mnemonic ? account.mnemonic : bip39.generateMnemonic(128);

        try {
            const maxWalletIdx = account.solWallets.length > 0 ? Math.max(...account.solWallets.map(w => w.walletIdx)) : -1;
            const wallet = createSolWallet(mnemonic, maxWalletIdx + 1);
            return { accountIdx: payload.accountIdx, mnemonic, wallet };
        } catch (err: any) {
            console.error("Error craeting SOL wallet: ", err);
            return rejectWithValue("Failed to create SOL wallet");
        }
    }
);

export const recoverWallets = createAsyncThunk(
    "app/recoverWallets",
    async (payload: { mnemonic: string, name?: string, accountIdx?: number }, { getState, rejectWithValue }) => {
        let { mnemonic, accountIdx, name } = payload;

        if (!mnemonic) {
            return rejectWithValue("Mnemonic is required");
        }

        if (!bip39.validateMnemonic(mnemonic)) {
            return rejectWithValue("Invalid mnemonic");
        }

        const state = getState() as { app: AppState };

        let create = false;
        let account: Account | undefined;

        if (accountIdx !== undefined) {
            account = state.app.accounts.find(a => a.accountIdx === accountIdx);

            if (!account) {
                return rejectWithValue("Account not found");
            }

            if (account?.ethWallets.length > 0 || account?.solWallets.length > 0) {
                return rejectWithValue("This account already has wallets, try in fresh account");
            }
        } else {
            let maxIdx =
                state.app.accounts.length > 0 ?
                    Math.max(...state.app.accounts.map(a => a.accountIdx)) :
                    -1;

            accountIdx = maxIdx + 1;
            create = true;
        }

        try {
            const wallets = await importWalletsByMnemonic(mnemonic);
            return { accountIdx, name, wallets, create, mnemonic, createdAt: Date.now() };
        } catch (err) {
            console.error("Error recovering wallets: ", err);
            return rejectWithValue("Failed to recover wallets");
        }
    }
)

export const fetchBalance = createAsyncThunk(
    "app/fetchBalance",
    async (payload: { walletType: walletType, walletAddress: string }, { rejectWithValue }) => {
        const { walletType, walletAddress } = payload;

        try {
            let balanceData;

            if (walletType === 'ETH') {
                balanceData = await getEthBalance(walletAddress);
            } else if (walletType === 'SOL') {
                balanceData = await getSolBalance(walletAddress);
            }

            return {
                walletType,
                walletAddress,
                balance: balanceData?.balance,
                balanceUsd: balanceData?.balanceUsd,
                lastUpdated: Date.now()
            }
        } catch (err) {
            console.error("Error fetching balance: ", err);
            return rejectWithValue("Failed to fetch balance");
        }
    }
)

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setActiveAccount: (state, action: PayloadAction<number>) => {
            state.activeAccountIdx = action.payload;

            const activeAccount = state.accounts.find(a => a.accountIdx === action.payload);
            const { solWallets, ethWallets }: any = activeAccount;

            if (ethWallets.length > 0) {
                state.activeWalletType = 'ETH';
                state.activeWalletIdx = 0;
            } else if (solWallets.length > 0) {
                state.activeWalletType = 'SOL';
                state.activeWalletIdx = 0;
            } else {
                state.activeWalletType = 'ETH';
                state.activeWalletIdx = -1;
            }
        },
        setActiveWalletType: (state, action: PayloadAction<walletType>) => {
            state.activeWalletType = action.payload;

            const activeAccount = state.accounts.find(a => a.accountIdx === state.activeAccountIdx);
            const { solWallets, ethWallets }: any = activeAccount;

            if (action.payload === 'ETH') {
                state.activeWalletIdx = ethWallets.length > 0 ? 0 : -1;
            } else {
                state.activeWalletIdx = solWallets.length > 0 ? 0 : -1;
            }
        },
        setActiveWalletIdx: (state, action: PayloadAction<number>) => {
            state.activeWalletIdx = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload)
                state.activeAccountIdx = action.payload.accountIdx;
                state.activeWalletIdx = -1;
            })
            .addCase(addEthWallet.fulfilled, (state, action) => {
                if (!action.payload) return;
                const { accountIdx, wallet, mnemonic } = action.payload;

                const account = state.accounts.find(
                    (a) => a.accountIdx === accountIdx
                );
                if (!account) return;

                account.mnemonic = mnemonic;
                account.ethWallets.push(wallet);
                state.activeWalletIdx = wallet.walletIdx;
            })
            .addCase(addSolWallet.fulfilled, (state, action) => {
                if (!action.payload) return;
                const { accountIdx, wallet, mnemonic } = action.payload;

                const account = state.accounts.find(
                    (a) => a.accountIdx === accountIdx
                );
                if (!account) return;

                account.mnemonic = mnemonic;
                account.solWallets.push(wallet);
                state.activeWalletIdx = wallet.walletIdx;
            })
            .addCase(recoverWallets.fulfilled, (state, action) => {
                if (!action.payload) return;
                const { accountIdx, name, create, wallets, mnemonic, createdAt } = action.payload;

                let account: Account | undefined;

                if (!create) {
                    account = state.accounts.find(a => a.accountIdx === accountIdx);
                    if (!account) return;

                    account.mnemonic = mnemonic;
                    account.ethWallets = wallets.ethWallets;
                    account.solWallets = wallets.solWallets;
                } else {
                    account = {
                        accountIdx,
                        mnemonic: mnemonic,
                        name: !!name ? name : `Account ${accountIdx}`,
                        ethWallets: wallets.ethWallets,
                        solWallets: wallets.solWallets,
                        createdAt
                    }
                    state.accounts.push(account);
                }

                state.activeAccountIdx = accountIdx;
                state.activeWalletIdx = 0;
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                if (!action.payload) return;
                const { walletType, walletAddress, balance, balanceUsd, lastUpdated } = action.payload;

                for (let account of state.accounts) {
                    const wallets = walletType === 'ETH' ? account.ethWallets : account.solWallets;

                    for (let wallet of wallets) {
                        if (wallet.address === walletAddress) {
                            wallet.balance = balance ?? 0;
                            wallet.balanceUsd = balanceUsd ?? 0;
                            wallet.lastUpdated = lastUpdated;
                        }
                    }
                }
            })
    }
})

export const { setActiveAccount, setActiveWalletType, setActiveWalletIdx } = appSlice.actions;
export default appSlice.reducer;