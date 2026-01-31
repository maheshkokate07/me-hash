import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { updateWallet, type Wallet } from "@/slices/appSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Check, CircleAlert, Copy, Eye, EyeOff, Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

type WalletInfoDialogProps = {
     wallet: Wallet;
     open: boolean;
     onOpenChange: (open: boolean) => void;
};

const chainLogos = {
     ETH: "/chains/eth.svg",
     SOL: "/chains/sol.svg",
};

export default function WalletInfoDialog({
     wallet,
     open,
     onOpenChange,
}: WalletInfoDialogProps) {
     const dispatch = useAppDispatch();
     const { activeAccountIdx, activeWalletType } = useAppSelector(state => state.app);

     const { walletIdx, address, privateKey, type, name } = wallet;

     const walletName = type === "SOL" ? "Solana" : "Ethereum";

     const [showPrivateKey, setShowPrivateKey] = useState(false);
     const [editting, setEditting] = useState(false);
     const [newName, setNewName] = useState(name);

     const toogleShowPrivateKey = () => setShowPrivateKey((prev) => !prev);

     const copyToClipboard = async (text: string) => {
          try {
               await navigator.clipboard.writeText(text);
               toast.success("Copied.");
          } catch (err) {
               toast.error("Failed to copy.");
          }
     };

     const toggleEditting = () => {
          if (editting) {
               dispatch(updateWallet({ accountIdx: activeAccountIdx, walletType: activeWalletType, walletIdx, name: newName }));
               toast.success("Wallet updated successfully.")
               setEditting(false);
          } else {
               setEditting(true);
          }
     }

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle className="flex items-center flex-col gap-1 justify-center">
                              <Avatar className="h-12 w-12">
                                   <AvatarFallback className="p-0 overflow-hidden">
                                        <img
                                             src={chainLogos[type]}
                                             alt={chainLogos[type]}
                                             className="h-full w-full object-cover"
                                        />
                                   </AvatarFallback>
                              </Avatar>
                              {walletName}
                         </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-1">
                         <Label htmlFor="wallet-name" className="ml-1">
                              Name
                         </Label>
                         <div className="flex gap-1">
                              <Input
                                   id="wallet-name"
                                   value={newName}
                                   disabled={!editting}
                                   onChange={(e) => setNewName(e.target.value)}
                                   className="disabled:opacity-90 disabled:text-gray-600 h-10"
                                   autoFocus
                              />
                              <Tooltip>
                                   <TooltipTrigger asChild>
                                        <Button
                                             variant="outline"
                                             className="cursor-pointer h-10"
                                             onClick={toggleEditting}
                                        >
                                             {editting ? <Check /> : <Pencil />}
                                        </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>{editting ? "Save" : "Edit"}</TooltipContent>
                              </Tooltip>
                         </div>
                    </div>

                    <div className="grid gap-1">
                         <Label htmlFor="wallet-address" className="ml-1">
                              Address
                         </Label>
                         <div className="flex gap-1">
                              <Input
                                   id="wallet-address"
                                   value={address}
                                   disabled={true}
                                   className="disabled:opacity-90 disabled:text-gray-600 h-10"
                                   autoFocus
                              />

                              <Tooltip>
                                   <TooltipTrigger asChild>
                                        <Button
                                             variant="outline"
                                             className="cursor-pointer h-10"
                                             onClick={() => copyToClipboard(address)}
                                        >
                                             <Copy />
                                        </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>Copy</TooltipContent>
                              </Tooltip>
                         </div>
                    </div>

                    <div className="grid gap-1">
                         <Label htmlFor="wallet-private-key" className="ml-1">
                              Private Key
                         </Label>

                         <div className="flex gap-1">
                              <Input
                                   id="wallet-private-key"
                                   type={showPrivateKey ? "text" : "password"}
                                   value={privateKey}
                                   disabled={true}
                                   className="disabled:opacity-90 disabled:text-gray-600 h-10"
                                   autoFocus
                              />

                              <Tooltip>
                                   <TooltipTrigger asChild>
                                        <Button
                                             variant="outline"
                                             className="cursor-pointer h-10"
                                             onClick={toogleShowPrivateKey}
                                        >
                                             {showPrivateKey ? <EyeOff /> : <Eye />}
                                        </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>{showPrivateKey ? "Hide" : "Show"}</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                   <TooltipTrigger asChild>
                                        <Button
                                             variant="outline"
                                             className="cursor-pointer h-10"
                                             onClick={() => copyToClipboard(privateKey)}
                                        >
                                             <Copy />
                                        </Button>
                                   </TooltipTrigger>
                                   <TooltipContent>Copy</TooltipContent>
                              </Tooltip>
                         </div>

                         <p className="text-xs flex items-center gap-1 text-muted-foreground ml-1 mt-1">
                              <CircleAlert className="h-4 w-4" /> Never share your private key or enter it into an app or website.
                         </p>
                    </div>
               </DialogContent>
          </Dialog>
     );
}