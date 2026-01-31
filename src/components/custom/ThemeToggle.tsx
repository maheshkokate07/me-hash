import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/providers/ThemeProvider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
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
        <div className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200 hide" />

            <Switch
                id="theme-switch"
                checked={checked}
                onCheckedChange={handleChange}
                className="cursor-pointer theme-switch"
            />

            <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200 hide" />
        </div>
    )
}