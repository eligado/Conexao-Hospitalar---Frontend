import { AppBar, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography variant="h6">Conexão Hospitalar</Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
}