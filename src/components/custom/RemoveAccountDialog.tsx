import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { removeAccount, type Account } from "@/slices/appSlice";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";
import { getInitials } from "@/utils/string/getInitials";

type RemoveAccountDialogProps = {
    activeAccount: Account;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onShowMnemonic: () => void;
};

export default function RemoveAccountDialog({
    activeAccount,
    open,
    onOpenChange,
    onShowMnemonic
}: RemoveAccountDialogProps) {

    const dispatch = useAppDispatch();

    const handleRemoveAccount = () => {
        try {
            dispatch(removeAccount(activeAccount.accountIdx));
            toast.success("Account removed successfully.")
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center">
                        Remove {activeAccount.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-5 mt-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="flex items-center justify-center text-sm font-semibold leading-none">
                            {activeAccount ? getInitials(activeAccount.name) : "NA"}
                        </AvatarFallback>
                    </Avatar>

                    {/* Subtitle */}
                    {activeAccount.mnemonic && <p className="text-sm sm:text-md text-gray-500 max-w-sm leading-relaxed text-center">
                        This will remove all the wallets you have created or imported. Make sure you have your existing secret recovery phrase and private keys saved.
                    </p>}
                </div>

                <div className="flex flex-col gap-3 items-center justify-center mt-5">
                    {activeAccount.mnemonic && <Button
                        variant="outline"
                        className="h-10 cursor-pointer font-semibold px-6 w-full"
                        onClick={onShowMnemonic}
                    >
                        Show Secret Recovery Phrase
                    </Button>}
                    <Button
                        variant="destructive"
                        className="h-10 cursor-pointer font-semibold px-6 w-full"
                        onClick={handleRemoveAccount}
                    >
                        Remove
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}