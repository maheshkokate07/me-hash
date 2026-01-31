import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Button } from "../ui/button";
import type { Wallet } from "@/slices/appSlice";
import { toast } from "sonner";

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
               toast.success("Copied.")
          } catch (err) {
               toast.error("Failed to copy.")
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
                         <p className="break-all w-64 sm:w-80 text-[20px] font-mono bg-muted text-foreground p-3 rounded-md border border-border">
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