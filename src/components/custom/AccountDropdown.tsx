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
import { setActiveAccount } from "@/slices/appSlice"
import { ChevronsUpDown } from "lucide-react"
import { AddAccountDialog } from "./AddAccountDialog"

export function AccountDropdown() {
     const dispatch = useAppDispatch()
     const { accounts, activeAccountIdx } = useAppSelector(state => state.app)

     const activeAccount = accounts.find(
          a => a.accountIdx === activeAccountIdx
     )

     const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("");

     return (
          <div className="flex items-center justify-center gap-2">
               <DropdownMenu>
                    <Avatar className="h-10 w-10">
                         <AvatarFallback className="flex items-center justify-center text-sm font-semibold leading-none">
                              {activeAccount ? getInitials(activeAccount.name) : "NA"}
                         </AvatarFallback>
                    </Avatar>
                    <DropdownMenuTrigger asChild>
                         <Button variant="outline" className="cursor-pointer text-gray-500 h-10 w-8">
                              <ChevronsUpDown />
                         </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64" align="start">
                         <DropdownMenuGroup>
                              {accounts.map(account => {
                                   const isActive = account.accountIdx === activeAccountIdx

                                   return (
                                        <DropdownMenuItem
                                             key={account.accountIdx}
                                             onClick={() =>
                                                  dispatch(setActiveAccount(account.accountIdx))
                                             }
                                             className={`flex items-center gap-3 ${isActive && "bg-accent text-accent-foreground"}`}
                                        >
                                             <Avatar className="h-8 w-8">
                                                  <AvatarFallback className="flex items-center justify-center text-xs font-semibold leading-none">
                                                       {getInitials(account.name)}
                                                  </AvatarFallback>
                                             </Avatar>

                                             <div className="flex flex-col">
                                                  <span className="text-sm">{account.name}</span>
                                                  <span className="text-xs text-gray-400">{account.solWallets.length + account.ethWallets.length + " wallets"}</span>
                                             </div>
                                        </DropdownMenuItem>
                                   )
                              })}
                         </DropdownMenuGroup>

                         <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                              <AddAccountDialog />
                         </DropdownMenuItem>

                    </DropdownMenuContent>
               </DropdownMenu>
          </div>
     )
}
