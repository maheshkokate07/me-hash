import { Moon, Sun } from "lucide-react"
// import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/providers/ThemeProvider"
// import { useEffect, useState } from "react"
import { Button } from "../ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    // Sync switch with current theme
    // useEffect(() => {
    //     setChecked(theme === "dark")
    // }, [theme])

    const handleChange = () => {
        setTheme(theme === 'light' ? "dark" : "light")
    }

    return (
        <div className="flex items-center gap-2">
            {/* <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200 hide" />

            <Switch
                id="theme-switch"
                checked={checked}
                onCheckedChange={handleChange}
                className="cursor-pointer theme-switch"
            />

            <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200 hide" /> */}
            <Button variant="outline" className="cursor-pointer h-10 relative" onClick={handleChange}>
                {
                    theme === "light"
                        ? <Moon className="scale-110 sm:scale-125 opacity-90" />
                        : <Sun className="scale-110 sm:scale-125 opacity-90" />
                }
            </Button>
        </div>
    )
}