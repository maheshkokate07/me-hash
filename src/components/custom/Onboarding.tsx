import { useState } from "react";
import { Button } from "../ui/button";
import { AddAccountDialog } from "./AddAccountDialog";
import Footer from "./Footer";
import { EarthLock } from "lucide-react";

export default function Onboarding({ footerHeight }: { footerHeight: string }) {
     const [addAccountOpen, setAddAccountOpen] = useState(false);
     const [addOnly, setAddOnly] = useState(false);
     const [recoverOnly, setRecoverOnly] = useState(false);

     const openCreateAccount = () => {
          setAddOnly(true);
          setRecoverOnly(false);
          setAddAccountOpen(true);
     };

     const openRecoverWallets = () => {
          setRecoverOnly(true);
          setAddOnly(false);
          setAddAccountOpen(true);
     };

     return (
          <>
               <div
                    style={{ height: `calc(100vh - ${footerHeight})` }}
                    className="flex items-center justify-center p-3 bg-background"
               >
                    <div className="w-full max-w-xl h-full max-h-110 flex flex-col items-center justify-between text-center">
                         <div className="flex flex-col items-center gap-5">
                              {/* Logo */}
                              <EarthLock size="78" />

                              {/* Title */}
                              <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
                                   Welcome to MeHash
                              </h1>

                              {/* Subtitle */}
                              <p className="text-md sm:text-lg text-muted-foreground max-w-md leading-relaxed">
                                   You’ll use this account to manage and access both{" "}
                                   <span className="font-medium text-foreground">Solana</span> and{" "}
                                   <span className="font-medium text-foreground">Ethereum</span> wallets.
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

                         {/* Dialog */}
                         <AddAccountDialog
                              open={addAccountOpen}
                              onOpenChange={setAddAccountOpen}
                              addOnly={addOnly}
                              recoverOnly={recoverOnly}
                         />
                    </div>
               </div>
               <Footer footerHeight={footerHeight} position="center" />
          </>
     );
}