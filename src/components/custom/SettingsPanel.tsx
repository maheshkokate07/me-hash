import { Button } from "@/components/ui/button"
import {
     Sheet,
     SheetClose,
     SheetContent,
     SheetDescription,
     SheetFooter,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet"
import { Settings } from "lucide-react"
import { Switch } from "../ui/switch"
import { useEffect, useState } from "react"
import { useTheme } from "@/providers/ThemeProvider"

export default function SettingsPanel() {

     const { theme, setTheme } = useTheme()
     const [checked, setChecked] = useState(false)

     // Sync switch with current theme
     useEffect(() => {
          setChecked(theme === "dark")
     }, [theme])

     const handleChange = (value: boolean) => {
          setChecked(value)
          setTheme(value ? "dark" : "light")
     }

     return (
          <Sheet>
               <SheetTrigger asChild>
                    <Button variant="outline" className="cursor-pointer h-10">
                         <Settings className="scale-130 opacity-90" />
                    </Button>
               </SheetTrigger>
               <SheetContent>
                    <SheetHeader>
                         <SheetTitle className="text-lg">App settings</SheetTitle>
                         <SheetDescription>
                              Make changes to your profile here. Click save when you&apos;re done.
                         </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-4 px-4">
                         <div className="flex items-center justify-between">
                              Developer mode <Switch className="panel-switch" />
                         </div>
                         <div className="flex items-center justify-between">
                              Dark mode <Switch checked={checked} onCheckedChange={handleChange} className="panel-switch" />
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