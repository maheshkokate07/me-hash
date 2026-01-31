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
     RefreshCcw,
     Settings,
     Timer,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { fetchBalance, type Wallet } from "@/slices/appSlice";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";

const chainLogos = {
     "ETH": "/chains/eth.svg",
     "SOL": "/chains/sol.svg"
}

export default function Wallet({
     wallet,
     onManage,
     onReceive
}: {
     wallet: Wallet,
     onManage: () => void,
     onReceive: () => void
}) {
     const symbol = wallet.type === "SOL" ? "SOL" : "ETH";

     const dispatch = useAppDispatch();
     const [refetching, setRefetching] = useState(false);
     const [canRefetch, setCanRefetch] = useState(false);

     const { type, lastUpdated, address } = wallet;

     const checkCanRefetch = () => {
          if (lastUpdated) {
               const timePassed = Date.now() - lastUpdated;
               return timePassed > 60 * 1000;
          }
          return false;
     };

     const refetchBalance = async () => {
          setRefetching(true);
          try {
               await dispatch(fetchBalance({ walletType: type, walletAddress: address }));
               toast.success("Balance refreshed successfully.")
          } catch (err: any) {
               toast.error(err);
          } finally {
               setRefetching(false);
          }
     }

     useEffect(() => {
          setCanRefetch(checkCanRefetch());

          const interval = setInterval(() => {
               setCanRefetch(checkCanRefetch());
          }, 5000);

          return () => clearInterval(interval);
     }, [lastUpdated]);

     return (
          <div className="flex-1">
               <div className="max-w-3xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
                    <Tabs defaultValue="tokens" className="w-full">
                         <div className="flex justify-center mb-10 sm:mb-12">
                              <TabsList className="bg-gray-100/70 backdrop-blur-sm border border-gray-200 rounded-full px-2 py-5">
                                   <TabsTrigger
                                        value="tokens"
                                        className="px-5 sm:px-7 py-3.5 text-sm sm:text-base rounded-full cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
                                   >
                                        Tokens
                                   </TabsTrigger>
                                   <TabsTrigger
                                        value="activity"
                                        className="px-5 sm:px-7 py-3.5 text-sm sm:text-base rounded-full cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
                                   >
                                        Activity
                                   </TabsTrigger>
                              </TabsList>
                         </div>

                         <div className="flex items-center justify-center mb-8 sm:mb-10">
                              <Avatar className="h-18 w-18 sm:w-20 sm:h-20">
                                   <AvatarFallback className="p-0 overflow-hidden">
                                        <img
                                             src={chainLogos[type]}
                                             alt={chainLogos[type]}
                                             className="h-full w-full object-cover"
                                        />
                                   </AvatarFallback>
                              </Avatar>
                         </div>

                         {/* TOKENS TAB */}
                         <TabsContent value="tokens" className="focus-visible:outline-none">
                              <div className="flex flex-col items-center gap-10 sm:gap-12">
                                   {/* Balance */}
                                   <div className="text-left">
                                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                                             <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                                                  ${wallet.balanceUsd.toFixed(2)}
                                             </h1>
                                             <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  disabled={!canRefetch || refetching}
                                                  onClick={refetchBalance}
                                                  className="h-10 w-10 rounded-full hover:bg-gray-100 mt-1 cursor-pointer -mr-13"
                                                  aria-label="Refresh balance"
                                             >
                                                  {
                                                       canRefetch ? <RefreshCcw className={`h-5 w-5 text-muted-foreground ${refetching && 'animate-spin'}`} /> : <Timer className={`h-5 w-5 text-muted-foreground`} />
                                                  }
                                             </Button>
                                        </div>
                                        <p className="mt-2 ml-1 text-xl sm:text-2xl font-medium text-muted-foreground">
                                             {wallet.balance.toFixed(4)} {symbol}
                                        </p>
                                   </div>

                                   {/* Action Buttons */}
                                   <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                                        <ActionButton icon={ArrowDownToLine} onClick={onReceive} label="Receive" />
                                        <ActionButton icon={ArrowUpFromLine} label="Send" />
                                        <ActionButton icon={Settings} onClick={onManage} label="Manage" />
                                   </div>
                              </div>
                         </TabsContent>

                         {/* ACTIVITY TAB */}
                         <TabsContent value="activity">
                              <div className="text-center">
                                   {/* <p className="text-base sm:text-lg text-muted-foreground font-medium">
                                        No activity yet.
                                   </p> */}
                                   {/* <p className="mt-2 text-sm text-muted-foreground/80">
                                        Transactions will appear here once you start using your wallet.
                                   </p> */}
                                   <p className="text-sm text-muted-foreground/80">
                                        This feature is coming soon...
                                   </p>
                              </div>
                         </TabsContent>
                    </Tabs>

               </div>
          </div>
     );
}

function ActionButton({
     icon: Icon,
     label,
     onClick = () => { }
}: {
     icon: React.ElementType;
     label: string;
     onClick?: () => void
}) {
     return (
          <button
               // variant="outline"
               onClick={onClick}
               className="h-20 w-22 sm:h-22 sm:w-24 cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-2 border-2 hover:bg-gray-50/80 transition-colors group"
          >
               <Icon className="sm:h-6 sm:w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
               <span className="text-xs sm:text-xs font-medium">{label}</span>
          </button>
     );
}