import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { AppSpinner } from "./Spinner";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAppDispatch } from "@/store/hooks";
import { addEthWallet, addSolWallet } from "@/slices/appSlice";
import { toast } from "sonner";

type AddWalletDialogProps = {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     walletType: 'SOL' | 'ETH';
     accountIdx: number;
}

const chainLogos = {
     "ETH": "/chains/eth.svg",
     "SOL": "/chains/sol.svg"
}

export default function AddWalletDialog({
     open,
     onOpenChange,
     walletType,
     accountIdx
}: AddWalletDialogProps) {

     const dispatch = useAppDispatch();

     const [name, setName] = useState("");
     const [creating, setCreating] = useState(false);

     const walletName = walletType === 'SOL' ? 'Solana' : 'Ethereum';

     const handleAdd = async () => {
          if (accountIdx === -1) {
               throw new Error("Select an account first.");
          }

          setCreating(true);

          try {
               if (walletType === 'SOL') {
                    await dispatch(addSolWallet({ accountIdx, name })).unwrap();
               } else if (walletType === 'ETH') {
                    await dispatch(addEthWallet({ accountIdx, name })).unwrap();
               } else {
                    throw new Error("Select a valid wallet type.");
               }

               toast.success(`${walletName} wallet addedd successfully.`)

               onOpenChange(false);
               setName("");
          } catch (err: any) {
               toast.error(err);
          } finally {
               setCreating(false);
          }
     };


     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                   <AvatarFallback className="p-0 overflow-hidden">
                                        <img
                                             src={chainLogos[walletType]}
                                             alt={chainLogos[walletType]}
                                             className="h-full w-full object-cover"
                                        />
                                   </AvatarFallback>
                              </Avatar>
                              Add {walletName} Wallet
                         </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-2">
                         <Label htmlFor="wallet-name">Wallet name</Label>
                         <Input
                              id="wallet-name"
                              placeholder="Enter wallet name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              autoFocus
                         />
                    </div>

                    <DialogFooter>
                         <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                         </DialogClose>

                         <Button
                              onClick={handleAdd}
                              disabled={!name || creating}
                         >
                              {creating ? <AppSpinner text="Adding..." /> : 'Add'}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
}