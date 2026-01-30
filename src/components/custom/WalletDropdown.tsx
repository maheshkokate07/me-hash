import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuTrigger,
     DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveWalletIdx } from "@/slices/appSlice"
import { ChevronsUpDown } from "lucide-react"

export function WalletDropdown() {
     const dispatch = useAppDispatch()

     const { accounts, activeAccountIdx, activeWalletType, activeWalletIdx } = useAppSelector(state => state.app);

     const activeAccount = accounts?.find(
          a => a.accountIdx === activeAccountIdx
     )

     const wallets = activeWalletType === "SOL" ? activeAccount?.solWallets : activeAccount?.ethWallets;

     return (
          <div className="flex items-center gap-2">
               <DropdownMenu>

                    <DropdownMenuTrigger asChild disabled={wallets?.length === 0}>
                         <Button
                              variant="ghost"
                              className="h-full px-3 rounded-none flex items-center hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                         >
                              <span className="h-6 flex items-center justify-center gap-1.5">
                                   {activeWalletIdx !== -1 ? `Wallet ${activeWalletIdx}` : `No ${activeWalletType} Accounts`}
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
                                                  <span className="text-sm font-medium">{`Wallet ${wallet.walletIdx}`}</span>
                                                  <span className="text-xs text-gray-400 truncate">{wallet.address}</span>
                                             </div>
                                        </DropdownMenuItem>
                                   )
                              })}
                         </DropdownMenuGroup>
                    </DropdownMenuContent>
               </DropdownMenu>
          </div>
     )
}
