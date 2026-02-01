import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const chainLogos = {
     "ETH": "/chains/eth.svg",
     "SOL": "/chains/sol.svg"
}

export default function ({ activeWalletType, openAddWallet }: { activeWalletType: 'SOL' | 'ETH', openAddWallet: () => void }) {

     const currentWalletName = activeWalletType === 'SOL' ? 'Solana' : 'Ethereum';

     return (
          <div className="max-w-3xl flex items-center flex-col mx-auto px-5 sm:px-6 py-8 sm:py-10">
               <div className="flex flex-col items-center gap-10">
                    <Avatar className="h-24 w-24">
                         <AvatarFallback className="p-0 overflow-hidden">
                              <img
                                   src={chainLogos[activeWalletType]}
                                   alt={chainLogos[activeWalletType]}
                                   className="h-full w-full object-cover"
                              />
                         </AvatarFallback>
                    </Avatar>

                    {/* Subtitle */}
                    <p className="text-sm text-center sm:text-md text-muted-foreground max-w-sm leading-relaxed">
                         This account doesn't have any <span className="font-medium">{currentWalletName}</span> wallets yet. You can add new one and start managing your assets.
                    </p>
               </div>

               {/* Buttons */}
               <div className="mt-10">
                    <Button
                         className="h-12 cursor-pointer text-md font-semibold px-10"
                         onClick={openAddWallet}
                    >
                         Add your first {currentWalletName} wallet
                    </Button>
               </div>
          </div>
     )
}