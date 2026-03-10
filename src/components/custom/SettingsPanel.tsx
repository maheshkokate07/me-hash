import { Button } from "@/components/ui/button"
import {
     Sheet,
     SheetClose,
     SheetContent,
     // SheetFooter,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet"
import { AlertCircle, ArrowUpRight, Dot, Settings, X } from "lucide-react"
import { Switch } from "../ui/switch"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveNetwork } from "@/slices/appSlice"
import { toast } from "sonner"
import { Separator } from "../ui/separator"
import { ThemeToggle } from "./ThemeToggle"

export default function SettingsPanel({ headerHeight }: { headerHeight: string }) {
     const dispatch = useAppDispatch();

     const { activeNetwork } = useAppSelector(state => state.app);

     const [isDevMode, setIsDevMode] = useState(false);

     useEffect(() => {
          setIsDevMode(activeNetwork === 'DEVNET');
     }, [activeNetwork]);

     const handleNetworkChange = (value: boolean) => {
          setIsDevMode(value);
          dispatch(setActiveNetwork(!!value ? 'DEVNET' : 'MAINNET'));
          toast(!!value ? "You're now in Test mode." : "Switched back to Normal mode.")
     }

     return (
          <Sheet>
               <SheetTrigger asChild>
                    <Button variant="outline" className="cursor-pointer h-10 relative">
                         <Settings className="scale-115 sm:scale-130 opacity-90" />
                         {activeNetwork === 'DEVNET' && <div className="bg-background rounded-full group absolute flex h-3.5 w-3.5 items-center justify-center bottom-7 left-7.5">
                              <Dot className="text-red-500 scale-340 sm:scale-380" />
                         </div>}
                    </Button>
               </SheetTrigger>
               <SheetContent showCloseButton={false}>
                    <SheetHeader className="border-b flex justify-center" style={{ height: headerHeight }}>
                         <SheetTitle className="text-lg flex items-center justify-between">
                              App settings
                              <div className="flex items-center gap-2">
                                   <ThemeToggle />
                                   <SheetClose asChild>
                                        <Button variant="ghost" className="h-10 cursor-pointer">
                                             <X className="scale-115 sm:scale-130" />
                                        </Button>
                                   </SheetClose>
                              </div>
                         </SheetTitle>
                    </SheetHeader>
                    {activeNetwork === 'DEVNET' && <div className="bg-destructive/30 w-full text-sm -mt-4 h-10 flex gap-2 px-4 items-center">
                         <AlertCircle size="14" />
                         <span className="mb-0.5">
                              You're in test mode
                         </span>
                    </div>}

                    <div className="flex-1 flex flex-col gap-4">
                         <div className="grid auto-rows-min gap-3 px-4">
                              <span className="text-muted-foreground text-xs -mt-1.5">
                                   Devnet faucets
                              </span>
                              <a
                                   href="https://faucet.solana.com"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="group text-sm font-medium cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md h-10 px-4 flex items-center justify-between gap-2"
                              >
                                   Solana faucet
                                   <ArrowUpRight size="16" className="transition group-hover:translate-x-0.5" />
                              </a>
                              <a
                                   href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="group text-sm font-medium cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md h-10 px-4 flex items-center justify-between gap-2"
                              >
                                   Ethereum faucet
                                   <ArrowUpRight size="16" className="transition group-hover:translate-x-0.5" />
                              </a>
                         </div>
                         {/* <Separator /> */}
                    </div>

                    <div className="grid auto-rows-min gap-3 px-4">
                         <div className="flex font-medium items-center justify-between">
                              Developer mode <Switch checked={isDevMode} onCheckedChange={handleNetworkChange} className="panel-switch" />
                         </div>
                    </div>
                    <Separator />
                    {/* <SheetFooter>
                         <SheetClose asChild>
                              <Button variant="outline">Close</Button>
                         </SheetClose>
                    </SheetFooter> */}
               </SheetContent>
          </Sheet>
     )
}