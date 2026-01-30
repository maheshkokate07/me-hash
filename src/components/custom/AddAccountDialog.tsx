import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
     Dialog,
     DialogClose,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/store/hooks";
import { createAccount, recoverWallets } from "@/slices/appSlice";
import { EraserIcon, Eye, EyeOff, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AppSpinner } from "./Spinner";

export function AddAccountDialog() {
     const dispatch = useAppDispatch();

     const [name, setName] = useState("");
     const [recover, setRecover] = useState(false);
     const [mnemonic, setMnemonic] = useState(Array(12).fill(""));
     const [hidden, setHidden] = useState(true);
     const [creating, setCreating] = useState(false);
     const [open, setOpen] = useState(false);

     // Handle pasting all 12 words at once
     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
          const paste = e.clipboardData.getData("text").trim().split(/\s+/);
          if (paste.length === 12) {
               setMnemonic(paste);
               e.preventDefault();
          }
     };

     const resetDialogState = () => {
          setName("");
          setRecover(false);
          setMnemonic(Array(12).fill(""));
     };

     const handleAdd = async () => {
          setCreating(true);

          try {
               if (recover) {
                    if (mnemonic.some(w => !w.trim())) {
                         throw new Error("Please enter all 12 mnemonic words");
                    }

                    const mnemonicStr = mnemonic.join(" ").toLowerCase();

                    await dispatch(
                         recoverWallets({
                              mnemonic: mnemonicStr,
                              name: name.trim() || undefined,
                         })
                    ).unwrap();
               } else {
                    await dispatch(
                         createAccount({ name: name.trim() || undefined })
                    ).unwrap();
               }

               resetDialogState();
               setOpen(false);
          } catch (err) {
               console.error(err);
          } finally {
               setCreating(false);
          }
     };

     const clearMnemonic = () => setMnemonic(Array(12).fill(""));
     const hideMnemonic = () => setHidden(prev => !prev);

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               {/* Trigger */}
               <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start px-2 py-3 gap-3 text-gray-800 cursor-pointer">
                         <Avatar className="h-8 w-8">
                              <AvatarFallback className="flex items-center justify-center">
                                   <Plus className="h-4 w-4" />
                              </AvatarFallback>
                         </Avatar>
                         <span className="text-sm">Add Account</span>
                    </Button>
               </DialogTrigger>

               {/* Content */}
               <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                         <DialogTitle>Add new account</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                         {/* Account Name */}
                         <div className="grid gap-2">
                              <Label htmlFor="account-name">Account name</Label>
                              <Input
                                   id="account-name"
                                   placeholder="Enter account name"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   autoFocus
                              />
                         </div>

                         {/* Recover Wallet Switch */}
                         <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                   <span>Recover existing wallets</span>
                                   <Switch id="recover-switch" checked={recover} onCheckedChange={setRecover} className="cursor-pointer" />
                              </div>
                              {recover && <div className="flex items-center gap-2 justify-end">
                                   <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button variant="outline" className="cursor-pointer" onClick={clearMnemonic}>
                                                  <EraserIcon />
                                             </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                             Clear
                                        </TooltipContent>
                                   </Tooltip>

                                   {/* Hide/Show button with tooltip */}
                                   <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button variant="outline" className="cursor-pointer" onClick={hideMnemonic}>
                                                  {hidden ? <Eye /> : <EyeOff />}
                                             </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                             {hidden ? "Show" : "Hide"}
                                        </TooltipContent>
                                   </Tooltip>
                              </div>}
                         </div>

                         {/* 12-word mnemonic inputs */}
                         {recover && (
                              <>
                                   <div className="grid grid-cols-3 gap-2">
                                        {mnemonic.map((word, idx) => (
                                             <Input
                                                  type={hidden ? "password" : "text"}
                                                  key={idx}
                                                  value={word}
                                                  onChange={(e) => {
                                                       const newWords = [...mnemonic];
                                                       newWords[idx] = e.target.value;
                                                       setMnemonic(newWords);
                                                  }}
                                                  className="text-center"
                                                  onPaste={handlePaste}
                                                  placeholder={`Word ${idx + 1}`}
                                             />
                                        ))}
                                   </div>
                                   <p className="text-xs text-muted-foreground">
                                        Type or paste your 12 word mnumonic phrase.
                                   </p>
                              </>
                         )}
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                         <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                         </DialogClose>

                         <Button onClick={handleAdd} disabled={!name.trim() || creating}>
                              {creating ? <AppSpinner text={recover ? "Recovering..." : "Creating..."} /> : recover ? "Recover" : "Add"}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
}