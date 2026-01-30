import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuPortal,
     DropdownMenuSeparator,
     DropdownMenuSub,
     DropdownMenuSubContent,
     DropdownMenuSubTrigger,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveAccount } from "@/slices/appSlice"
import { ChevronsUpDown, Plus, Settings } from "lucide-react"

export function AccountDropdown({ onAddAccount }: { onAddAccount: () => void }) {
     const dispatch = useAppDispatch()
     const { accounts, activeAccountIdx } = useAppSelector(state => state.app);

     const activeAccount = accounts?.find(
          a => a.accountIdx === activeAccountIdx
     )

     const isAccountEmpty = activeAccount?.solWallets.length === 0 && activeAccount?.ethWallets.length === 0;

     const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

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
                              {accounts?.map(account => {
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
                                                  <span className="text-sm font-medium">{account.name}</span>
                                                  <span className="text-xs text-gray-400">{account.solWallets.length + account.ethWallets.length + " wallets"}</span>
                                             </div>
                                        </DropdownMenuItem>
                                   )
                              })}
                         </DropdownMenuGroup>

                         <DropdownMenuSeparator />

                         <DropdownMenuItem
                              onSelect={(e) => {
                                   e.preventDefault();
                                   onAddAccount();
                              }}
                              className="flex items-center gap-3 font-medium cursor-pointer"
                         >
                              <Avatar className="h-8 w-8">
                                   <AvatarFallback className="flex items-center justify-center">
                                        <Plus className="h-4 w-4" />
                                   </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">Add Account</span>
                         </DropdownMenuItem>

                         <DropdownMenuSeparator />

                         <DropdownMenuSub>
                              <DropdownMenuSubTrigger
                                   onSelect={(e) => {
                                        e.preventDefault();
                                        onAddAccount();
                                   }}
                                   className="flex items-center gap-3 font-medium cursor-pointer"
                              >
                                   <Avatar className="h-8 w-8">
                                        <AvatarFallback className="flex items-center justify-center">
                                             <Settings className="h-4 w-4" />
                                        </AvatarFallback>
                                   </Avatar>
                                   <span className="text-sm">Settings</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                   <DropdownMenuSubContent>
                                        <DropdownMenuItem className="py-2 px-4">Update Account Name</DropdownMenuItem>
                                        <DropdownMenuItem className="py-2 px-4">{isAccountEmpty ? 'Recover Wallets' : 'Secret Recovery Phrase'}</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="py-2 px-4 focus:bg-red-100 text-red-600 focus:text-red-700">Remove</DropdownMenuItem>
                                   </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                         </DropdownMenuSub>
                    </DropdownMenuContent>
               </DropdownMenu>
          </div>
     )
}
