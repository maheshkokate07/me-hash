export default function Footer() {
    return (
        <footer className="border-t border-muted flex px-5 justify-left items-center h-14">
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