import { useState } from "react";
import { Button } from "../ui/button";
import { AddAccountDialog } from "./AddAccountDialog";

export default function Onboarding() {
     const [addAccountOpen, setAddAccountOpen] = useState(false);
     const [addOnly, setAddOnly] = useState(false);
     const [recoverOnly, setRecoverOnly] = useState(false);

     // Open "Create Account" dialog
     const openCreateAccount = () => {
          setAddOnly(true);
          setRecoverOnly(false);
          setAddAccountOpen(true);
     };

     // Open "Recover Wallets" dialog
     const openRecoverWallets = () => {
          setRecoverOnly(true);
          setAddOnly(false);
          setAddAccountOpen(true);
     };

     return (
          <div className="h-screen flex items-center justify-center p-3">
               <div className="w-full max-w-xl h-full max-h-120 flex flex-col items-center justify-between text-center">
                    <div className="flex flex-col items-center gap-5">
                         {/* Avatar / Logo */}
                         <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-3xl font-bold text-gray-900 select-none">MH</span>
                         </div>

                         {/* Title */}
                         <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                              Welcome to MeHash
                         </h1>

                         {/* Subtitle */}
                         <p className="text-md sm:text-lg text-gray-500 max-w-md leading-relaxed">
                              You’ll use this account to manage and access both{" "}
                              <span className="font-medium text-gray-700">Solana</span> and{" "}
                              <span className="font-medium text-gray-700">Ethereum</span> wallets.
                         </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-4 w-full max-w-sm mt-5">
                         <Button
                              className="h-12 cursor-pointer text-lg font-semibold"
                              onClick={openCreateAccount}
                         >
                              Create a new account
                         </Button>
                         <Button
                              variant="outline"
                              className="h-12 cursor-pointer text-lg font-semibold"
                              onClick={openRecoverWallets}
                         >
                              Recover existing wallets
                         </Button>
                    </div>

                    {/* Add Account Dialog */}
                    <AddAccountDialog
                         open={addAccountOpen}
                         onOpenChange={setAddAccountOpen}
                         addOnly={addOnly}
                         recoverOnly={recoverOnly}
                    />
               </div>
          </div>
     );
}