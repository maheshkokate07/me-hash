import {
     Item,
     ItemContent,
     ItemMedia,
     ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

export function AppSpinner({ text }: { text?: string }) {
     return (
          <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">
               <Item>
                    <ItemMedia>
                         <Spinner />
                    </ItemMedia>
                    {text && <ItemContent>
                         <ItemTitle className="line-clamp-1">{text}</ItemTitle>
                    </ItemContent>}
               </Item>
          </div>
     )
}