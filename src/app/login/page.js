"use client";
import {useEffect, useState} from "react";
import {useRouter} from 'next/navigation';
import {Box, Container, TextField, Button, Typography, Link, Alert} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {IconButton, InputAdornment} from "@mui/material";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [lembrar, setLembrar] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.title = "Conexão hospitalar";
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8000/api/auth/login/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password}),
            });

            const data = await res.json();

            if (res.ok) {
                setErro(false);
                setMensagem("✅ Login realizado com sucesso!");

                const storage = lembrar ? localStorage : sessionStorage;

                // 🟢 Salva os tokens JWT
                storage.setItem("access", data.access);
                storage.setItem("refresh", data.refresh);

                // Salva também os dados do usuário
                storage.setItem("usuario", JSON.stringify(data.user));

                setTimeout(() => {
                    router.push("/");
                }, 1200);
            } else {
                setErro(true);
                setMensagem(
                    data?.non_field_errors?.[0] ||
                    data?.detail ||
                    "❌ Impossível fazer login com as credenciais fornecidas."
                );
            }
        } catch (err) {
            console.error(err);
            setErro(true);
            setMensagem("❌ Erro de rede ou servidor.");
        }
    };

    return (

        <Box display="flex" height="100vh">
            {/* Esquerda */}
            <Box
                flex={1.5}
                sx={{
                    background: "linear-gradient(to top right, #22E4CD, #2196F3)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box display="flex" alignItems="center" mb={1}>
                    <img
                        src="/logo-white.png"
                        alt="Logo"
                        style={{width: 70, height: 70, marginRight: 8}}
                    />
                    <Typography variant="h4" sx={{fontWeight: "bold", fontSize: "3.5rem"}}>
                        Conexão Hospitalar
                    </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{fontSize: "3rem", margin: "0", padding: "0"}}>
                    O caminho certo para <span style={{display: "block", marginTop: "-28px"}}>a sua saúde!</span>
                </Typography>
            </Box>

            {/* Direita */}
            <Box flex={1} display="flex" justifyContent="center" alignItems="center">
                <Container maxWidth="sm">
                    <Typography variant="h4" gutterBottom sx={{textAlign: "center"}}>
                        Faça seu login
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <Box mb={2}>
                            <TextField
                                label="Usuário"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img
                                                src="/mail.png"
                                                alt="Email Icone"
                                                style={{width: 24, height: 24}}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="Senha"
                                type={showPassword ? "text" : "password"}
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img
                                                src="/lock.png"
                                                alt="Senha Icone"
                                                style={{width: 24, height: 24}}
                                            />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >

                            <Link href="/register" variant="body2">
                                Cadastre-se
                            </Link>
                        </Box>

                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    fontSize: "0.875rem",
                                    padding: "8px 16px",
                                    backgroundColor: "#1B75BC",
                                }}
                            >
                                Entrar
                            </Button>
                        </Box>
                    </form>

                    {mensagem && (
                        <Box mt={2}>
                            <Alert severity={erro ? "error" : "success"}>{mensagem}</Alert>
                        </Box>
                    )}
                </Container>
            </Box>
        </Box>

    );
}
