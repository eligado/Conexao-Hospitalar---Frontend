"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, TextField, Button, Typography, Link, Alert } from "@mui/material";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      setErro(true);
      setMensagem("❌ As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password1,
          password2,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setErro(false);
        setMensagem("✅ Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        const errorMsg =
          data?.username?.[0] ||
          data?.email?.[0] ||
          data?.password1?.[0] ||
          data?.non_field_errors?.[0] ||
          "❌ Erro no cadastro. Verifique os dados.";
        setErro(true);
        setMensagem(errorMsg);
      }
    } catch (err) {
      setErro(true);
      setMensagem("❌ Erro de rede ou servidor.");
      console.error(err);
    }
  };

  return (
    <Box display="flex" height="100vh">
      {/* Lado esquerdo */} 
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

      {/* Lado direito - Formulário */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Faça seu cadastro
          </Typography>

          <form onSubmit={handleRegister}>
            <Box mb={2}>
              <TextField
                label="Usuário"
                type="text"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Box>
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
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Confirmar senha"
                type="password"
                fullWidth
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Link href="/login" variant="body2" underline="hover">
                Já tem uma conta? Faça login
              </Link>
            </Box>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Cadastrar
            </Button>

            {/* ✅ Mensagem abaixo do botão */}
            {mensagem && (
              <Box mt={2}>
                <Alert severity={erro ? "error" : "success"}>{mensagem}</Alert>
              </Box>
            )}
          </form>
        </Container>
      </Box>
    </Box>
  );
}