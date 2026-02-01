import {
     Item,
     ItemContent,
     ItemMedia,
     ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

export function AppSpinner({ text }: { text?: string }) {
     return (
          <Item className="flex gap-2">
               <ItemMedia>
                    <Spinner />
               </ItemMedia>
               {text && <ItemContent>
                    <ItemTitle className="line-clamp-1">{text}</ItemTitle>
               </ItemContent>}
          </Item>
     )
}