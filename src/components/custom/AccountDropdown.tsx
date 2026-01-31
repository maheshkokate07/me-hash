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

export function AccountDropdown({
     onAddAccount,
     onUpdateAccount,
     onRecoverAccount,
     onShowMnemonic,
     onRemoveAccount
}: {
     onAddAccount: () => void,
     onUpdateAccount: () => void,
     onRecoverAccount: () => void
     onShowMnemonic: () => void,
     onRemoveAccount: () => void
}) {
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
                    <DropdownMenuTrigger asChild>
                         <div className="flex items-center gap-2 cursor-pointer">
                              <Avatar className="h-10 w-10">
                                   <AvatarFallback className="flex hover:bg-gray-200 transition items-center justify-center text-sm font-semibold leading-none">
                                        {activeAccount ? getInitials(activeAccount.name) : "NA"}
                                   </AvatarFallback>
                              </Avatar>

                              <Button variant="outline" className="cursor-pointer hide text-gray-500 h-10 w-8">
                                   <ChevronsUpDown />
                              </Button>
                         </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64" align="start">
                         <DropdownMenuGroup>
                              {accounts?.map(account => {
                                   const isActive = account.accountIdx === activeAccountIdx;
                                   const totalWallets = account.solWallets.length + account.ethWallets.length;

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
                                                  <span className="text-sm font-medium truncate w-44">{account.name}</span>
                                                  <span className="text-xs text-gray-400">{totalWallets} {totalWallets === 1 ? "wallet" : "wallets"}</span>
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
                                        <DropdownMenuItem
                                             onSelect={(e) => {
                                                  e.preventDefault();
                                                  onUpdateAccount();
                                             }}
                                             className="py-2 px-4"
                                        >
                                             Update Account Name
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                             className="py-2 px-4"
                                             onSelect={(e) => {
                                                  e.preventDefault();
                                                  if (isAccountEmpty) {
                                                       onRecoverAccount();
                                                  } else {
                                                       onShowMnemonic();
                                                  }
                                             }}
                                        >
                                             {isAccountEmpty ? 'Recover Wallets' : 'Secret Recovery Phrase'}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                             className="py-2 px-4 focus:bg-red-100 text-red-600 focus:text-red-700"
                                             onSelect={(e) => {
                                                  e.preventDefault();
                                                  onRemoveAccount();
                                             }}
                                        >
                                             Remove
                                        </DropdownMenuItem>
                                   </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                         </DropdownMenuSub>
                    </DropdownMenuContent>
               </DropdownMenu>
          </div >
     )
}