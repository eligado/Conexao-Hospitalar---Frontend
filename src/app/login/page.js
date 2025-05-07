"use client";
import {useState} from "react";
import {Box, Container, TextField, Button, Typography, Link} from "@mui/material";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
    };

    return (
        <Box display="flex" height="100vh">
            <Box
                flex={1}
                sx={{
                    background: "linear-gradient(to bottom, #2196f3, #1e88e5)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" sx={{fontWeight: "bold"}}>
                    Conexão Hospitalar
                </Typography>
            </Box>

            {/* Right Section */}
            <Box
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Container maxWidth="sm">
                    <Typography variant="h4" gutterBottom>
                        Faça seu login
                    </Typography>
                    <form onSubmit={handleLogin}>
                        <Box mb={2}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="Senha"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Box>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Link href="/forgot-password" variant="body2" underline="hover">
                                Esqueceu a senha?
                            </Link>
                            <Link href="/register" variant="body2" underline="hover">
                                Cadastra-se
                            </Link>
                        </Box>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </form>
                </Container>
            </Box>
        </Box>
    );
}