"use client";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { Box, Container, TextField, Button, Typography, Link, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const router = useRouter();

    useEffect(() => {
        document.title = "Conexão hospitalar";
    }, []);

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
              style={{ width: 70, height: 70, marginRight: 8 }}
          />
          <Typography variant="h4" sx={{ fontWeight: "bold",fontSize: "3.5rem"  }}>
            Conexão Hospitalar
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ fontSize: "3rem", margin: "0", padding: "0" }}>
          O caminho certo para <span style={{ display: "block", marginTop: "-28px" }}>a sua saúde!</span>
        </Typography>
      </Box>

      {/* Lado direito - Formulário */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="center">
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
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
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start">
                       <img
                         src="/user.png"
                         alt="User Icon"
                         style={{ width: 24, height: 24 }}
                       />
                     </InputAdornment>
                   ),
                 }}
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
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start">
                       <img
                         src="/mail.png"
                         alt="Email Icon"
                         style={{ width: 24, height: 24 }}
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
                 value={password1}
                 onChange={(e) => setPassword1(e.target.value)}
                 required
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start">
                       <img
                         src="/lock.png"
                         alt="Lock Icon"
                         style={{ width: 24, height: 24 }}
                       />
                     </InputAdornment>
                   ),
                   endAdornment: (
                     <InputAdornment position="end">
                       <IconButton
                         onClick={() => setShowPassword(!showPassword)}
                         edge="end"
                       >
                         {showPassword ? <VisibilityOff /> : <Visibility />}
                       </IconButton>
                     </InputAdornment>
                   ),
                 }}
               />
             </Box>
             <Box mb={2}>
               <TextField
                 label="Confirmar senha"
                 type={showPassword ? "text" : "password"}
                 fullWidth
                 value={password2}
                 onChange={(e) => setPassword2(e.target.value)}
                 required
                 InputProps={{
                   startAdornment: (
                     <InputAdornment position="start">
                       <img
                         src="/lock.png"
                         alt="Lock Icon"
                         style={{ width: 24, height: 24 }}
                       />
                     </InputAdornment>
                   ),
                   endAdornment: (
                     <InputAdornment position="end">
                       <IconButton
                         onClick={() => setShowPassword(!showPassword)}
                         edge="end"
                       >
                         {showPassword ? <VisibilityOff /> : <Visibility />}
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
              <Link href="/login" variant="body2" underline="hover">
                Já tem uma conta? Faça login
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
                Cadastrar
              </Button>
            </Box>

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