import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as bip39 from 'bip39';
import { createEthWallet } from "../utils/eth/createEthWallet";
import { createSolWallet } from "../utils/sol/createSolWallet";

export interface Wallet {
    walletIdx: number;
    type: 'SOL' | 'ETH';
    address: string;
    privateKey: string;
    path: string;
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
}

const initialState: AppState = {
    accounts: [],
    activeAccountIdx: -1
}

export const createAccount = createAsyncThunk(
    "app/createAccount",
    (payload: { name: string }, { getState }) => {
        const state = getState() as { app: AppState };
        const maxIdx =
            state.app.accounts.length > 0 ?
                Math.max(...state.app.accounts.map(a => a.accountIdx)) :
                -1;

        const mnemonic = bip39.generateMnemonic(128);

        const newAccount: Account = {
            accountIdx: maxIdx + 1,
            name: payload.name,
            mnemonic,
            ethWallets: [],
            solWallets: [],
            createdAt: Date.now()
        }

        return newAccount;
    },
);

export const addEthWallet = createAsyncThunk(
    "app/addEthWallet",
    (payload: { accountIdx: number }, { getState }) => {
        const state = getState() as { app: AppState };
        const account = state.app.accounts.find(a => a.accountIdx === payload.accountIdx);
        if (!account) return;

        const maxWalletIdx = account.ethWallets.length > 0 ? Math.max(...account.ethWallets.map(w => w.walletIdx)) : -1;

        const wallet = createEthWallet(account.mnemonic, maxWalletIdx + 1);

        return { accountIdx: payload.accountIdx, wallet };
    }
);

export const addSolWallet = createAsyncThunk(
    "app/addSolWallet",
    (payload: { accountIdx: number }, { getState }) => {
        const state = getState() as { app: AppState };
        const account = state.app.accounts.find(a => a.accountIdx === payload.accountIdx);
        if (!account) return;

        const maxWalletIdx = account.solWallets.length > 0 ? Math.max(...account.solWallets.map(w => w.walletIdx)) : -1;

        const wallet = createSolWallet(account.mnemonic, maxWalletIdx + 1);

        return { accountIdx: payload.accountIdx, wallet };
    }
);

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setActiveAccount: (state, action: PayloadAction<number>) => {
            state.activeAccountIdx = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload)
                state.activeAccountIdx = action.payload.accountIdx;
            })
            .addCase(addEthWallet.fulfilled, (state, action) => {
                if (!action.payload) return;
                const { accountIdx, wallet } = action.payload;

                const account = state.accounts.find(
                    (a) => a.accountIdx === accountIdx
                );
                if (!account) return;

                account.ethWallets.push(wallet);
            })
            .addCase(addSolWallet.fulfilled, (state, action) => {
                if (!action.payload) return;
                const { accountIdx, wallet } = action.payload;

                const account = state.accounts.find(
                    (a) => a.accountIdx === accountIdx
                );
                if (!account) return;

                account.solWallets.push(wallet);
            });
    }
})

export const { setActiveAccount } = appSlice.actions;
export default appSlice.reducer;