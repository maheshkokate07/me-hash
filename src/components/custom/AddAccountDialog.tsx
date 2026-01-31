import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
     Dialog,
     DialogClose,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/store/hooks";
import { createAccount, recoverWallets, updateAccount } from "@/slices/appSlice";
import { ClipboardPaste, EraserIcon, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AppSpinner } from "./Spinner";

type AddAccountDialogProps = {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     recoverOnly?: boolean;
     addOnly?: boolean;
     updateOnly?: boolean;
     accountName?: string;
     accountIdx?: number;
};

export function AddAccountDialog({
     open,
     onOpenChange,
     recoverOnly,
     addOnly,
     updateOnly,
     accountName,
     accountIdx
}: AddAccountDialogProps) {
     const dispatch = useAppDispatch();

     const [name, setName] = useState("");
     const [recover, setRecover] = useState(false);
     const [mnemonic, setMnemonic] = useState(Array(12).fill(""));
     const [hidden, setHidden] = useState(true);
     const [creating, setCreating] = useState(false);

     useEffect(() => {
          if (open) {
               if (updateOnly && accountName) {
                    setName(accountName);
               } else {
                    setName("");
               }
               setMnemonic(Array(12).fill(""));
               setHidden(true);
               if (recoverOnly) {
                    setRecover(true);
               } else if (addOnly) {
                    setRecover(false);
               } else {
                    setRecover(false);
               }
          }
     }, [open, recoverOnly, addOnly]);

     const handleAdd = async () => {
          setCreating(true);

          try {
               if (recoverOnly || (!addOnly && recover)) {
                    if (mnemonic.some((w) => !w.trim())) {
                         throw new Error("Please enter all 12 mnemonic words");
                    }

                    const mnemonicStr = mnemonic.join(" ").toLowerCase();

                    await dispatch(
                         recoverWallets({
                              mnemonic: mnemonicStr,
                              name: name.trim() || undefined,
                              accountIdx
                         })
                    ).unwrap();
               } else if (addOnly || (!recoverOnly && !recover && !updateOnly)) {
                    await dispatch(createAccount({ name: name.trim() || undefined })).unwrap();
               } else if (updateOnly && accountIdx) {
                    await dispatch(updateAccount({ accountIdx, name }));
               }

               onOpenChange(false);
          } catch (err) {
               console.error("Failed to create account: ", err);
          } finally {
               setCreating(false);
          }
     };

     const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
          const paste = e.clipboardData.getData("text").trim().split(/\s+/);
          if (paste.length === 12) {
               setMnemonic(paste);
               e.preventDefault();
          }
     };

     const pasteMnemonic = async () => {
          try {
               const text = await navigator.clipboard.readText();
               const words = text.trim().split(/\s+/);

               if (words.length === 12) {
                    setMnemonic(words);
                    alert("Mnemonic pasted successfully!");
               } else {
                    alert("Clipboard does not contain exactly 12 words.");
               }
          } catch (err) {
               console.error("Failed to read clipboard: ", err);
               alert("Unable to read clipboard. Please try manually.");
          }
     };

     const clearMnemonic = () => setMnemonic(Array(12).fill(""));
     const toggleHidden = () => setHidden((prev) => !prev);

     let title = "Add new account";
     let buttonText = "Add";

     if (recoverOnly) {
          title = "Recover existing wallets";
          buttonText = "Recover";
     } else if (addOnly) {
          title = "Add new account";
          buttonText = "Add";
     } else if (updateOnly) {
          title = "Update account name";
          buttonText = "Update"
     } else {
          title = recover ? "Recover existing wallets" : "Add new account";
          buttonText = recover ? "Recover" : "Add";
     }

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                         <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                         {/* Account Name Input */}
                         {((!recoverOnly && !addOnly) || updateOnly) && (
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
                         )}

                         {/* Account Name input for addOnly */}
                         {addOnly && (
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
                         )}

                         {/* Recover Wallet Switch */}
                         {!recoverOnly && !addOnly && !updateOnly && (
                              <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                        <span>Recover existing wallets</span>
                                        <Switch
                                             id="recover-switch"
                                             checked={recover}
                                             onCheckedChange={setRecover}
                                             className="cursor-pointer"
                                        />
                                   </div>
                                   {recover && (
                                        <MnemonicControls
                                             pasteMnemonic={pasteMnemonic}
                                             clearMnemonic={clearMnemonic}
                                             hidden={hidden}
                                             toggleHidden={toggleHidden}
                                        />
                                   )}
                              </div>
                         )}

                         {/* Mnemonic inputs for recoverOnly */}
                         {recoverOnly && (
                              <MnemonicControls
                                   pasteMnemonic={pasteMnemonic}
                                   clearMnemonic={clearMnemonic}
                                   hidden={hidden}
                                   toggleHidden={toggleHidden}
                              />
                         )}

                         {/* Mnemonic Inputs */}
                         {(recoverOnly || recover) && !addOnly && (
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
                                                  placeholder={`${idx + 1}`}
                                             />
                                        ))}
                                   </div>
                                   <p className="text-xs text-muted-foreground">
                                        Type or paste your 12 word mnemonic phrase.
                                   </p>
                              </>
                         )}
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                         <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                         </DialogClose>

                         <Button
                              onClick={handleAdd}
                              disabled={
                                   (updateOnly && !name.trim()) ||
                                   (recoverOnly && mnemonic.some((w) => !w.trim())) ||
                                   (addOnly && !name.trim()) ||
                                   (!recoverOnly && !addOnly && (recover ? mnemonic.some((w) => !w.trim()) : !name.trim())) ||
                                   creating
                              }
                         >
                              {creating ? (
                                   <AppSpinner text={updateOnly ? "Updating..." : (recover || recoverOnly) ? "Recovering..." : "Creating..."} />
                              ) : (
                                   buttonText
                              )}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
}

function MnemonicControls({
     pasteMnemonic,
     clearMnemonic,
     hidden,
     toggleHidden,
}: {
     pasteMnemonic: () => void;
     clearMnemonic: () => void;
     hidden: boolean;
     toggleHidden: () => void;
}) {
     return (
          <div className="flex items-center gap-2 justify-end">
               <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" className="cursor-pointer" onClick={pasteMnemonic}>
                              <ClipboardPaste />
                         </Button>
                    </TooltipTrigger>
                    <TooltipContent>Paste</TooltipContent>
               </Tooltip>

               <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" className="cursor-pointer" onClick={clearMnemonic}>
                              <EraserIcon />
                         </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear</TooltipContent>
               </Tooltip>

               <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="outline" className="cursor-pointer" onClick={toggleHidden}>
                              {hidden ? <Eye /> : <EyeOff />}
                         </Button>
                    </TooltipTrigger>
                    <TooltipContent>{hidden ? "Show" : "Hide"}</TooltipContent>
               </Tooltip>
          </div>
     );
}