import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Wallet } from "@/slices/appSlice";

type ReceiveDialogProps = {
     wallet: Wallet;
     open: boolean;
     onOpenChange: (open: boolean) => void;
};

export default function ReceiveDialog({
     wallet,
     open,
     onOpenChange,
}: ReceiveDialogProps) {
     const { address, type } = wallet;
     const walletName = type === "SOL" ? "Solana" : "Ethereum";

     const copyToClipboard = async () => {
          try {
               await navigator.clipboard.writeText(address);
               alert("Copied");
          } catch (err) {
               console.error("Failed to copy text:", err);
          }
     };

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle className="w-full text-center text-xl font-semibold">
                              Deposit
                         </DialogTitle>
                    </DialogHeader>

                    <div className="text-center flex items-center flex-col gap-6 mt-4">
                         <p className="w-70 text-wrap wrap-break-word text-lg">
                              {address}
                         </p>
                         <Button
                              className="cursor-pointer text-md px-4.5 py-5.5"
                              onClick={copyToClipboard}
                         >
                              Copy address
                         </Button>
                         <p className="text-sm text-muted-foreground w-50">
                              This address can only receive assets on <span className="font-semibold">{walletName}</span>.
                         </p>
                    </div>
               </DialogContent>
          </Dialog>
     );
}