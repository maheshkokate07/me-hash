import { Button } from "@/components/ui/button";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveWalletType } from "@/slices/appSlice";
import { Check } from "lucide-react";

type WalletType = "SOL" | "ETH";

const chains = [
     {
          key: "ETH" as WalletType,
          name: "Ethereum",
          image: "/chains/eth.svg",
     },
     {
          key: "SOL" as WalletType,
          name: "Solana",
          image: "/chains/sol.svg",
     },
];

export function ChainDropdown() {
     const dispatch = useAppDispatch();
     const activeWalletType = useAppSelector(
          (state) => state.app.activeWalletType
     );

     const activeChain: any = chains.find(
          (c) => c.key === activeWalletType
     );

     return (
          <div className="flex items-center gap-2">
               <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button
                              variant="ghost"
                              className="h-full px-3 rounded-none flex items-center hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                         >
                              <Avatar className="h-6 w-6">
                                   <AvatarFallback className="p-0 overflow-hidden">
                                        <img
                                             src={activeChain.image}
                                             alt={activeChain.name}
                                             className="h-full w-full object-cover"
                                        />
                                   </AvatarFallback>
                              </Avatar>
                         </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="start">
                         <DropdownMenuGroup>
                              {chains.map((chain) => {
                                   const isActive = chain.key === activeWalletType;

                                   return (
                                        <DropdownMenuItem
                                             key={chain.key}
                                             onClick={() =>
                                                  dispatch(setActiveWalletType(chain.key))
                                             }
                                             className={`flex items-center gap-3 cursor-pointer ${isActive ? "bg-accent" : ""
                                                  }`}
                                        >
                                             {/* Check icon */}
                                             <div className="w-4 flex justify-center">
                                                  {isActive && (
                                                       <Check className="h-4 w-4 text-primary" />
                                                  )}
                                             </div>

                                             {/* Chain avatar */}
                                             <Avatar className="h-8 w-8">
                                                  <AvatarFallback className="p-0 overflow-hidden">
                                                       <img
                                                            src={chain.image}
                                                            alt={chain.name}
                                                            className="h-full w-full object-cover"
                                                       />
                                                  </AvatarFallback>
                                             </Avatar>

                                             {/* Chain info */}
                                             <div className="flex flex-col">
                                                  <span className="text-sm font-medium">
                                                       {chain.name}
                                                  </span>
                                                  <span className="text-xs text-muted-foreground">
                                                       {chain.key}
                                                  </span>
                                             </div>
                                        </DropdownMenuItem>
                                   );
                              })}
                         </DropdownMenuGroup>
                    </DropdownMenuContent>
               </DropdownMenu>
          </div>
     );
}