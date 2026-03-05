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
import { Settings } from "lucide-react"
import { Switch } from "../ui/switch"
import { useEffect, useState } from "react"
import { useTheme } from "@/providers/ThemeProvider"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setActiveNetwork } from "@/slices/appSlice"

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
     }

     return (
          <Sheet>
               <SheetTrigger asChild>
                    <Button variant="outline" className="cursor-pointer h-10">
                         <Settings className="scale-110 sm:scale-130 opacity-90" />
                    </Button>
               </SheetTrigger>
               <SheetContent showCloseButton={false}>
                    <SheetHeader className="border-b flex justify-center" style={{ height: headerHeight }}>
                         <SheetTitle className="text-lg">App settings</SheetTitle>
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