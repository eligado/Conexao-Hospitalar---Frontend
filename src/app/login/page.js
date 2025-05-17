"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Box, Container, TextField, Button, Typography, Link, Alert, FormControlLabel, Checkbox } from "@mui/material";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lembrar, setLembrar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:8000/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Conexão Hospitalar
        </Typography>
      </Box>

      {/* Direita */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
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

            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    color="primary"
                  />
                }
                label="Lembrar-me"
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Link href="/forgot-password" variant="body2">
                Esqueceu a senha?
              </Link>
              <Link href="/register" variant="body2">
                Cadastre-se
              </Link>
            </Box>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
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
