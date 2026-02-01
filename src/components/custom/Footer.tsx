export default function Footer({ footerHeight, position }: { footerHeight: string, position: string }) {
    return (
        <footer
            style={{ height: footerHeight, justifyContent: position }}
            className="border-t border-muted flex px-5 items-center"
        >
            <p className="text-sm text-muted-foreground">
                Designed and Developed by{" "}
                <a
                    href="https://maheshkokate.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                >
                    Mahesh
                </a>
            </p>
        </footer>
    )
}