import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveWalletIdx } from "@/slices/appSlice"
import { ChevronsUpDown, Plus } from "lucide-react"

export function WalletDropdown({ onAddWallet }: { onAddWallet: () => void }) {
     const dispatch = useAppDispatch()

     const { accounts, activeAccountIdx, activeWalletType, activeWalletIdx } = useAppSelector(state => state.app);

     const activeAccount = accounts?.find(
          a => a.accountIdx === activeAccountIdx
     )

     const wallets = activeWalletType === "SOL" ? activeAccount?.solWallets : activeAccount?.ethWallets;

     const activeWallet: any = wallets?.find(w => w.walletIdx === activeWalletIdx);

     return (
          <div className="flex items-center gap-2">
               <DropdownMenu>

                    <DropdownMenuTrigger asChild disabled={wallets?.length === 0}>
                         <Button
                              variant="ghost"
                              className="h-full cursor-pointer px-3 rounded-none flex items-center hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                         >
                              <span className="h-6 flex items-center justify-center gap-1.5">
                                   <span className={`${activeWalletIdx !== -1 ? 'max-w-18 sm:min-w-18 sm:max-w-28 md:max-w-30' : 'w-25'} truncate`}>
                                        {activeWalletIdx !== -1 ? `${activeWallet.name}` : `No ${activeWalletType} Wallets`}
                                   </span>
                                   {activeWalletIdx !== -1 && <ChevronsUpDown className="text-gray-500" />}
                              </span>
                         </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64" align="start">
                         <DropdownMenuGroup>
                              {wallets?.map((wallet: any) => {
                                   const isActive = wallet.walletIdx === activeWalletIdx;

                                   return (
                                        <DropdownMenuItem
                                             key={wallet.address}
                                             onClick={() =>
                                                  dispatch(setActiveWalletIdx(wallet.walletIdx))
                                             }
                                             className={`flex items-center gap-3 ${isActive && "bg-accent text-accent-foreground"}`}
                                        >
                                             <Avatar className="h-9 w-9">
                                                  <AvatarFallback className="flex items-center justify-center text-xs font-semibold leading-none">
                                                       {wallet.type}
                                                  </AvatarFallback>
                                             </Avatar>

                                             <div className="flex flex-col overflow-hidden gap-0.5">
                                                  <span className="text-sm font-medium">{`${wallet.name}`}</span>
                                                  <span className="text-xs text-muted-foreground truncate">{wallet.address}</span>
                                             </div>
                                        </DropdownMenuItem>
                                   )
                              })}
                         </DropdownMenuGroup>

                         <DropdownMenuSeparator />

                         <DropdownMenuItem
                              onSelect={(e) => {
                                   e.preventDefault();
                                   onAddWallet();
                              }}
                              className="flex items-center gap-3 font-medium cursor-pointer"
                         >
                              <Avatar className="h-9 w-9">
                                   <AvatarFallback className="flex items-center justify-center">
                                        <Plus className="h-4 w-4" />
                                   </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">Add {activeWalletType} Wallet</span>
                         </DropdownMenuItem>

                    </DropdownMenuContent>
               </DropdownMenu>
          </div>
     )
}