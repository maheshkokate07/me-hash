import { confirmTransferNativeTx, sendTransferNativeTx, type walletType } from "@/slices/appSlice";
import { useAppDispatch } from "@/store/hooks"
import { useState } from "react";

export const useTransferNative = () => {
    const dispatch = useAppDispatch();

    const [isSending, setIsSending] = useState(false);
    // const [isConfirming, setIsConfirming] = useState(false);

    const sendNativeTx = async (payload: {
        accountIdx: number,
        walletType: walletType,
        amount: string,
        toPubKey: string,
        walletAddress: string
    }) => {
        setIsSending(true);

        try {
            const txData = await dispatch(sendTransferNativeTx(payload)).unwrap();

            const {
                accountIdx,
                walletType,
                walletAddress,
                txHash
            } = txData;

            setIsSending(false);
            // setIsConfirming(true);

            dispatch(confirmTransferNativeTx({
                accountIdx,
                walletType,
                walletAddress,
                txHash
            })).unwrap();

            return txData;
        } catch (err) {
            throw err;
        } finally {
            setIsSending(false);
            // setIsConfirming(false);
        }
    }

    return {
        sendNativeTx,
        isSending,
        // isConfirmingF
    };
}