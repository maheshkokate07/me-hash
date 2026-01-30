import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

const chainLogos = {
     "ETH": "/chains/eth.svg",
     "SOL": "/chains/sol.svg"
}

export default function ({ activeWalletType, openAddWallet }: { activeWalletType: 'SOL' | 'ETH', openAddWallet: () => void }) {

     const currentWalletName = activeWalletType === 'SOL' ? 'Solana' : 'Ethereum';

     return (
          <div className="flex-1 flex items-center justify-center p-4 max-w-4xl mx-auto">
               <div className="w-full max-w-xl h-full max-h-70 flex flex-col items-center justify-between text-center">
                    <div className="flex flex-col items-center gap-5">
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
                         <p className="text-sm sm:text-md text-gray-500 max-w-sm leading-relaxed">
                              This account doesn't have any <span className="font-medium text-gray-700">{currentWalletName}</span> wallets yet. You can add new one and start managing your assets.
                         </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-4 mt-5">
                         <Button
                              className="h-12 cursor-pointer text-md font-semibold px-10"
                              onClick={openAddWallet}
                         >
                              Add your first {currentWalletName} wallet
                         </Button>
                    </div>
               </div>
          </div>
     )
}