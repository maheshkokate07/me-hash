import { DialogTitle } from "@radix-ui/react-dialog";
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { AppSpinner } from "./Spinner";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { type Wallet } from "@/slices/appSlice";
import { toast } from "sonner";
import { useTransferNative } from "@/hooks/useTransferNative";
import { ArrowLeft, CircleAlert, CircleCheck } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { isValidEthAddress } from "@/utils/eth/isValidEthAddress";
import { isValidSolAddress } from "@/utils/sol/isValidSolAddress";

type TransferNativeDialogProps = {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     wallet: Wallet;
     accountIdx: number;
     tokenPriceUsd: number | null
};

const chainLogos = {
     ETH: "/chains/eth.svg",
     SOL: "/chains/sol.svg",
};

const decimals = {
     ETH: 18,
     SOL: 9
}

export default function TransferNativeDialog({
     open,
     onOpenChange,
     wallet,
     accountIdx,
     tokenPriceUsd
}: TransferNativeDialogProps) {
     const { sendNativeTx, isSending } = useTransferNative();

     const walletType = wallet.type;
     const symbol = walletType === "SOL" ? "SOL" : "ETH";

     const [step, setStep] = useState<1 | 2>(1);
     const [to, setTo] = useState("");
     const [amount, setAmount] = useState("");
     const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
     const amountInputRef = useRef<HTMLInputElement>(null);
     const toInputRef = useRef<HTMLInputElement>(null);

     const shortenAddress = (addr: string) =>
          `${addr.slice(0, 4)}...${addr.slice(-4)}`;

     const handleNext = () => {
          if (!to) return;
          setStep(2);
     };

     const handleSend = async () => {
          try {
               await sendNativeTx({
                    accountIdx,
                    walletType,
                    amount: amount,
                    toPubKey: to.trim(),
                    walletAddress: wallet.address,
               });

               toast.success("Transaction sent to network.");
               onOpenChange(false);
          } catch (err: any) {
               toast.error(err);
          }
     };

     const handleAmountChange = (value: string) => {
          if (value.startsWith(".")) {
               value = "0" + value;
          }
          const regex = new RegExp(`^\\d*(\\.\\d{0,${decimals[walletType]}})?$`);
          if (regex.test(value)) {
               setAmount(value);
          }
     };

     const copyWalletAddress = async () => {
          try {
               await navigator.clipboard.writeText(to);
               toast.success("Copied.");
          } catch {
               toast.error("Failed to copy.");
          }
     };

     const usdValue =
          amount && tokenPriceUsd
               ? (Number(amount) * tokenPriceUsd).toFixed(2)
               : null;

     useEffect(() => {
          if (!to) {
               setIsValidAddress(null);
               return;
          }

          const timer = setTimeout(() => {
               const valid =
                    walletType === "ETH"
                         ? isValidEthAddress(to.trim())
                         : isValidSolAddress(to.trim());

               setIsValidAddress(valid);
          }, 400);

          return () => clearTimeout(timer);
     }, [to, walletType]);

     useEffect(() => {
          if (step === 2 && amountInputRef.current) {
               amountInputRef.current.focus();
          }
          if (step === 1 && toInputRef.current) {
               toInputRef.current.focus();
          }
     }, [step]);

     useEffect(() => {
          if (!open) {
               setTimeout(() => {
                    setStep(1);
                    setTo("");
                    setAmount("");
                    setIsValidAddress(null);
               }, 200);
          }
     }, [open]);

     useEffect(() => {
          const handleBeforeUnload = (event: BeforeUnloadEvent) => {
               if (isSending) {
                    event.preventDefault();
               }
          };
          window.addEventListener("beforeunload", handleBeforeUnload);
          return () => {
               window.removeEventListener("beforeunload", handleBeforeUnload);
          };
     }, [isSending]);

     return (
          <Dialog open={open} onOpenChange={isSending ? () => { } : onOpenChange}>
               <DialogContent className="sm:max-w-md flex flex-col items-center" showCloseButton={!isSending}>

                    <DialogHeader className="items-center gap-3 w-full">
                         {
                              (step === 2 && !isSending) &&
                              <ArrowLeft
                                   onClick={() => setStep(1)}
                                   className="left-6 absolute top-7 opacity-70 hover:opacity-90 transition cursor-pointer rounded-full"
                              />
                         }
                         <DialogTitle className="text-2xl font-semibold">
                              Send {symbol}
                         </DialogTitle>
                    </DialogHeader>

                    <div className="w-full relative h-48 mt-8">
                         <div
                              className={`absolute flex flex-col items-center gap-2 inset-0 transition-all duration-300 ease-in-out ${step === 1 ? "opacity-100 translate-x-0 z-10" : "opacity-0 -translate-x-4 z-0 pointer-events-none"}`}>
                              <Avatar className="h-20 w-20">
                                   <AvatarFallback className="p-0 overflow-hidden">
                                        <img
                                             src={chainLogos[walletType]}
                                             alt={chainLogos[walletType]}
                                             className="h-full w-full object-cover"
                                        />
                                   </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-2 w-full mt-8">
                                   <Label htmlFor="recipient-address">Recipient address</Label>
                                   <Input
                                        ref={toInputRef}
                                        aria-invalid={isValidAddress === false}
                                        aria-valid={isValidAddress === true}
                                        id="recipient-address"
                                        className="h-10"
                                        placeholder="Enter recipient address"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        autoFocus
                                   />
                                   {
                                        isValidAddress === false &&
                                        <div className="text-xs text-destructive flex items-center gap-1 -mt-0.5 ml-0.5">
                                             <CircleAlert size={14} />
                                             <span>
                                                  Invalid address for network
                                             </span>
                                        </div>
                                   }
                                   {
                                        isValidAddress === true &&
                                        <div className="text-xs text-chart-2 flex items-center gap-1 -mt-0.5 ml-0.5">
                                             <CircleCheck size={14} />
                                             <span>
                                                  Valid {walletType === 'ETH' ? 'Ethereum' : 'Solana'} address
                                             </span>
                                        </div>
                                   }
                              </div>
                         </div>

                         <div
                              className={`absolute inset-0 transition-all duration-300 ease-in-out ${step === 2 ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-4 z-0 pointer-events-none"} flex flex-col items-center`}
                         >
                              <div
                                   onClick={copyWalletAddress}
                                   className="text-center text-sm font-medium cursor-pointer bg-muted py-0.5 px-2 rounded-sm text-muted-foreground"
                              >
                                   {shortenAddress(to)}
                              </div>
                              <div className="items-end justify-center mt-8">
                                   <input
                                        disabled={isSending}
                                        ref={amountInputRef}
                                        className={`${amount.length > 17 ? 'text-2xl sm:text-3xl' : amount.length > 13 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} h-12 pt-0 pb-1 font-bold text-center outline-none bg-transparent w-full`}
                                        placeholder="0"
                                        value={amount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                        inputMode="decimal"
                                   />
                              </div>
                              <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-medium text-muted-foreground mt-4">
                                   <Avatar className="h-5.5 w-5.5 sm:h-6.5 sm:w-6.5">
                                        <AvatarFallback className="p-0 overflow-hidden">
                                             <img
                                                  src={chainLogos[walletType]}
                                                  alt={symbol}
                                                  className="h-full w-full object-cover"
                                             />
                                        </AvatarFallback>
                                   </Avatar>
                                   <span className="mb-0.5">
                                        {symbol}
                                   </span>
                              </div>
                              <p className="text-center font-medium text-muted-foreground w-full mt-4">
                                   {`$${usdValue ? usdValue : '0.00'}`}
                              </p>
                         </div>
                    </div>

                    <DialogFooter className="w-full mt-8">
                         <Button
                              className="w-full cursor-pointer h-10"
                              onClick={step === 1 ? handleNext : handleSend}
                              disabled={
                                   step === 1
                                        ? !to || isValidAddress === false
                                        : !amount || +amount === 0 || isSending
                              }
                         >
                              {step === 1 ? (
                                   "Next"
                              ) : isSending ? (
                                   <AppSpinner text="Sending..." />
                              ) : (
                                   `Send ${symbol}`
                              )}
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
}
