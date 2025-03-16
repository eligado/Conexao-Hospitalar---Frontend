import { Container, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
    return (
        <div className="layout">
            <main className="content">
                <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
                    <Typography variant="h4" gutterBottom>
                        Bem-vindo ao Sistema de Hospitais
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Clique no botão abaixo para ver a lista de hospitais.
                    </Typography>
                    <Link href="/hospitais" passHref>
                        <Button variant="contained" color="primary" size="large">
                            Ver Hospitais
                        </Button>
                    </Link>
                </Container>
            </main>
        </div>
    );
}