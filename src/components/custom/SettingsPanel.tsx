import { Button } from "@/components/ui/button"
import {
     Sheet,
     SheetClose,
     SheetContent,
     // SheetDescription,
     SheetFooter,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet"
import { CircleAlert, Dot, Settings } from "lucide-react"
import { Switch } from "../ui/switch"
import { useEffect, useState } from "react"
import { useTheme } from "@/providers/ThemeProvider"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveNetwork } from "@/slices/appSlice"
import { Badge } from "../ui/badge"
import { toast } from "sonner"

export default function SettingsPanel({ headerHeight }: { headerHeight: string }) {
     const dispatch = useAppDispatch();

     const { activeNetwork } = useAppSelector(state => state.app);

     const { theme, setTheme } = useTheme()
     const [isDarkMode, setIsDarkMode] = useState(false);
     const [isDevMode, setIsDevMode] = useState(false);

     // Sync switch with current theme
     useEffect(() => {
          setIsDarkMode(theme === "dark")
     }, [theme])

     useEffect(() => {
          setIsDevMode(activeNetwork === 'DEVNET');
     }, [activeNetwork]);

     const handleThemeChange = (value: boolean) => {
          setIsDarkMode(value)
          setTheme(value ? "dark" : "light")
     }

     const handleNetworkChange = (value: boolean) => {
          setIsDevMode(value);
          dispatch(setActiveNetwork(!!value ? 'DEVNET' : 'MAINNET'));
          toast(!!value ? "You're now in Test mode." : "Switched back to Normal mode.")
     }

     return (
          <Sheet>
               <SheetTrigger asChild>
                    <Button variant="outline" className="cursor-pointer h-10 relative">
                         <Settings className="scale-115 sm:scale-130 opacity-90" />
                         {activeNetwork === 'DEVNET' && <div className="bg-background rounded-full group absolute flex h-3.5 w-3.5 items-center justify-center bottom-7 left-7.5">
                              <Dot className="text-red-500 scale-340 sm:scale-380" />
                         </div>}
                    </Button>
               </SheetTrigger>
               <SheetContent showCloseButton={false}>
                    <SheetHeader className="border-b flex justify-center" style={{ height: headerHeight }}>
                         <SheetTitle className="text-lg flex items-center justify-between">
                              App settings
                              {activeNetwork === 'DEVNET' && <Badge variant="destructive" className="flex items-center gap-1">
                                   <CircleAlert style={{ marginTop: '1px' }} />
                                   Test mode
                              </Badge>}
                         </SheetTitle>
                         {/* <SheetDescription>
                              Make changes to your profile here. Click save when you&apos;re done.
                         </SheetDescription> */}
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-4 px-4">
                         <div className="flex items-center justify-between">
                              Developer mode <Switch checked={isDevMode} onCheckedChange={handleNetworkChange} className="panel-switch" />
                         </div>
                         <div className="flex items-center justify-between">
                              Dark theme <Switch checked={isDarkMode} onCheckedChange={handleThemeChange} className="panel-switch" />
                         </div>
                    </div>
                    <SheetFooter>
                         {/* <Button type="submit">Save changes</Button> */}
                         <SheetClose asChild>
                              <Button variant="outline">Close</Button>
                         </SheetClose>
                    </SheetFooter>
               </SheetContent>
          </Sheet>
     )
}