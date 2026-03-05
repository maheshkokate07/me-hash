import {
     Tabs,
     TabsContent,
     TabsList,
     TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
     ArrowDownToLine,
     ArrowUpFromLine,
     ArrowUpRight,
     Copy,
     RefreshCcw,
     Settings,
     Timer,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { fetchBalance, fetchSignatures, type networkType, type Wallet } from "@/slices/appSlice";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function Wallet({
     wallet,
     onReceive,
     onSend,
     onManage,
     activeNetwork
}: {
     wallet: Wallet;
     onManage: () => void;
     onSend: () => void;
     onReceive: () => void;
     activeNetwork: networkType
}) {
     const symbol = wallet.type === "SOL" ? "SOL" : "ETH";

     const dispatch = useAppDispatch();
     const [refetchingBalance, setRefetchingBalance] = useState(false);
     const [refetchingSignatures, setRefetchingSignatures] = useState(false);
     const [canRefetchBalance, setCanRefetchBalance] = useState(false);
     const [canRefetchSignatures, setCanRefetchSignatures] = useState(false);

     const { type, address, } = wallet;
     const { lastBalanceFetched, signatures, lastSignaturesFetched, balanceUsd, balance } = wallet[activeNetwork];

     const checkCanRefetchBalance = () => {
          if (lastBalanceFetched) {
               const timePassed = Date.now() - lastBalanceFetched;
               return timePassed > 60 * 1000;
          }
          return false;
     };

     const checkCanRefetchSignatures = () => {
          if (lastSignaturesFetched) {
               const timePassed = Date.now() - lastSignaturesFetched;
               return timePassed > 60 * 1000;
          }
          return false;
     }

     const refetchBalance = async () => {
          setRefetchingBalance(true);
          try {
               await dispatch(
                    fetchBalance({ walletType: type, walletAddress: address })
               );
               toast.success("Balance refreshed successfully.");
          } catch (err: any) {
               toast.error(err);
          } finally {
               setRefetchingBalance(false);
          }
     };

     const refetchSignatures = async () => {
          setRefetchingSignatures(true);
          try {
               await dispatch(
                    fetchSignatures({ walletType: type, walletAddress: address })
               );
               toast.success("History refreshed successfully.")
          } catch (err: any) {
               toast.error(err);
          } finally {
               setRefetchingSignatures(false);
          }
     }

     useEffect(() => {
          setCanRefetchBalance(checkCanRefetchBalance());
          setCanRefetchSignatures(checkCanRefetchSignatures());


          const interval = setInterval(() => {
               setCanRefetchBalance(checkCanRefetchBalance());
               setCanRefetchSignatures(checkCanRefetchSignatures());
          }, 5000);

          return () => clearInterval(interval);
     }, [lastBalanceFetched, lastSignaturesFetched]);

     return (
          <div className="max-w-4xl mx-auto px-5 sm:px-6 py-8 sm:py-10">

               <Tabs defaultValue="tokens" className="w-full">
                    {/* Tabs */}
                    <div className="flex justify-center mb-10 sm:mb-12">
                         <TabsList className="bg-muted/70 backdrop-blur-sm border border-border rounded-full px-2 py-5">
                              <TabsTrigger
                                   value="tokens"
                                   className="px-5 sm:px-7 py-3.5 text-sm sm:text-base rounded-full cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
                              >
                                   Tokens
                              </TabsTrigger>
                              <TabsTrigger
                                   value="activity"
                                   className="px-5 sm:px-7 py-3.5 text-sm sm:text-base rounded-full cursor-pointer data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
                              >
                                   Activity
                              </TabsTrigger>
                         </TabsList>
                    </div>

                    {/* TOKENS TAB */}
                    <TabsContent
                         value="tokens"
                         className="focus-visible:outline-none"
                    >
                         <div className="flex flex-col items-center gap-10 sm:gap-12">
                              {/* Balance */}
                              <div className="text-left">
                                   <div className="flex items-center justify-center gap-2 sm:gap-3">
                                        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
                                             ${balanceUsd.toFixed(2)}
                                        </h1>
                                        <Button
                                             size="icon"
                                             variant="ghost"
                                             disabled={!canRefetchBalance || refetchingBalance}
                                             onClick={refetchBalance}
                                             className="h-10 w-10 rounded-full hover:bg-accent mt-2 cursor-pointer -mr-13"
                                             aria-label="Refresh balance"
                                        >
                                             {canRefetchBalance ? (
                                                  <RefreshCcw
                                                       className={`h-5 w-5 text-muted-foreground ${refetchingBalance && "animate-spin"}`}
                                                  />
                                             ) : (
                                                  <Timer className="h-5 w-5 text-muted-foreground" />
                                             )}
                                        </Button>
                                   </div>
                                   <p className="mt-2 ml-1 text-xl sm:text-2xl font-medium text-muted-foreground">
                                        {balance.toFixed(5)} {symbol}
                                   </p>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                                   <ActionButton
                                        icon={ArrowDownToLine}
                                        onClick={onReceive}
                                        label="Receive"
                                   />
                                   <ActionButton
                                        icon={ArrowUpFromLine}
                                        onClick={onSend}
                                        label="Send"
                                   />
                                   <ActionButton
                                        icon={Settings}
                                        onClick={onManage}
                                        label="Manage"
                                   />
                              </div>
                         </div>
                    </TabsContent>

                    {/* ACTIVITY TAB */}
                    <TabsContent value="activity" className="focus-visible:outline-none">
                         <div className="rounded-lg border bg-card overflow-hidden">
                              <div className="overflow-x-auto">
                                   <Table>
                                        <TableHeader>
                                             <TableRow className="border-b hover:bg-muted/60 bg-muted/60">
                                                  <TableHead className="h-14 px-4 sm:px-6 font-medium text-lg text-accent-foreground/90">
                                                       Transaction History
                                                  </TableHead>
                                                  {!!signatures.length && <>
                                                       <TableHead></TableHead>
                                                       <TableHead></TableHead>
                                                  </>}
                                                  <TableHead className="h-14 px-4 w-30 sm:px-6">
                                                       <button
                                                            aria-label="Refresh balance"
                                                            disabled={!canRefetchSignatures || refetchingSignatures}
                                                            onClick={refetchSignatures}
                                                            className="flex items-center disabled:opacity-70 disabled:cursor-not-allowed rounded-[3px] bg-accent hover:bg-transparent transition cursor-pointer text-accent-foreground/90 px-2.5 py-1.5 border gap-1.5 text-xs group ">
                                                            {canRefetchSignatures ?
                                                                 <RefreshCcw size="12" className={`${refetchingSignatures && 'animate-spin'}`} /> :
                                                                 <Timer size="13" />
                                                            }
                                                            Refresh
                                                       </button>
                                                  </TableHead>
                                             </TableRow>
                                             {!!signatures.length && <TableRow className="border-b hover:bg-transparent">
                                                  <TableHead className="h-12 px-4 sm:px-6 text-xs text-muted-foreground">
                                                       TRANSACTION SIGNATURE
                                                  </TableHead>
                                                  <TableHead className="h-12 px-4 sm:px-6 text-xs text-muted-foreground w-32 md:w-40 lg:w-48">
                                                       BLOCK
                                                  </TableHead>
                                                  <TableHead className="h-12 px-4 sm:px-6 text-xs text-muted-foreground w-44 sm:w-52">
                                                       TIMESTAMP
                                                  </TableHead>
                                                  <TableHead className="h-12 px-4 sm:px-6 text-xs text-muted-foreground w-28 text-center">
                                                       STATUS
                                                  </TableHead>
                                             </TableRow>}
                                        </TableHeader>

                                        <TableBody>
                                             {signatures?.map((s) => {
                                                  const displaySig =
                                                       s.signature.length > 48
                                                            ? `${s.signature.slice(0, 48)}...`
                                                            : s.signature;

                                                  const solscanUrl = `https://explorer.solana.com/tx/${s.signature}?cluster=${activeNetwork.toLowerCase()}`;
                                                  const etherscanUrl = `https://${activeNetwork === 'DEVNET' ? 'sepolia.' : ''}etherscan.io/tx/${s.signature}`;

                                                  const copyToClipboard = () => {
                                                       navigator.clipboard.writeText(s.signature);
                                                       toast.success("Signature copied.");
                                                  };

                                                  return (
                                                       <TableRow
                                                            key={s.signature}
                                                            className="bg-muted/60 transition-colors h-14 border-b last:border-none text-accent-foreground/80"
                                                       >
                                                            <TableCell className="px-4 sm:px-6 py-4 font-mono text-xs leading-relaxed">
                                                                 <div className="flex items-center gap-1 group">
                                                                      {/* Copy button */}
                                                                      <span
                                                                           className="flex items-center justify-center h-6 w-6 opacity-70 hover:opacity-100 cursor-pointer"
                                                                           onClick={copyToClipboard}
                                                                           aria-label="Copy signature"
                                                                      >
                                                                           <Copy size="13" />
                                                                      </span>

                                                                      {/* Clickable truncated signature */}
                                                                      <a
                                                                           href={wallet.type === 'SOL' ? solscanUrl : etherscanUrl}
                                                                           target="_blank"
                                                                           rel="noopener noreferrer"
                                                                           className="hover:text-primary flex items-center cursor-pointer transition-colors flex-1 break-all md:break-normal"
                                                                      >
                                                                           {displaySig}
                                                                           <ArrowUpRight size="14" className="group-hover:scale-110 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                                                      </a>
                                                                 </div>
                                                            </TableCell>

                                                            <TableCell className="px-4 sm:px-6 py-4 text-xs tabular-nums">
                                                                 {s.slot.toLocaleString()}
                                                            </TableCell>

                                                            <TableCell className="px-4 sm:px-6 py-4 text-xs tabular-nums whitespace-nowrap">
                                                                 {s.blockTime
                                                                      ? (() => {
                                                                           const dt = new Date(s.blockTime * 1000);

                                                                           const month = dt.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
                                                                           const day = dt.getUTCDate();                  // number → no zero-pad needed
                                                                           const year = dt.getUTCFullYear();
                                                                           const hours = dt.getUTCHours().toString().padStart(2, "0");
                                                                           const minutes = dt.getUTCMinutes().toString().padStart(2, "0");
                                                                           const seconds = dt.getUTCSeconds().toString().padStart(2, "0");

                                                                           return `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
                                                                      })()
                                                                      : "—"}
                                                            </TableCell>

                                                            <TableCell className="px-4 sm:px-6 py-4 text-center">
                                                                 <span className="inline-flex items-center rounded-full bg-muted-foreground/10  px-2.5 py-0.5 text-xs">
                                                                      {s.confirmationStatus}
                                                                 </span>
                                                            </TableCell>
                                                       </TableRow>
                                                  );
                                             })}
                                        </TableBody>
                                   </Table>
                              </div>

                              {signatures.length === 0 && (
                                   <div className="py-8 text-center text-muted-foreground ">
                                        No transactions found
                                   </div>
                              )}
                         </div>
                    </TabsContent>
               </Tabs>
          </div>
     );
}

function ActionButton({
     icon: Icon,
     label,
     onClick = () => { },
}: {
     icon: React.ElementType;
     label: string;
     onClick?: () => void;
}) {
     return (
          <button
               onClick={onClick}
               className="h-20 w-22 sm:h-22 sm:w-24 cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-2 border border-border bg-muted/40 hover:bg-accent transition-colors group"
          >
               <Icon className="sm:h-6 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
               <span className="text-xs font-medium text-foreground">
                    {label}
               </span>
          </button>
     );
}