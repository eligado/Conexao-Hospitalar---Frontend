"use client";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CardMedia, Chip, Box, Divider, Link, TextField, Button, Alert, } from "@mui/material";

export default function Page() {
  const [hospitais, setHospitais] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [novosComentarios, setNovosComentarios] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  const usuario = typeof window !== "undefined" && localStorage.getItem("usuario")
    ? JSON.parse(localStorage.getItem("usuario"))
    : null;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/hospitais/")
      .then((res) => res.json())
      .then(setHospitais)
      .catch(console.error);

    fetch("http://127.0.0.1:8000/api/comentarios/")
      .then((res) => res.json())
      .then((data) => {
        const agrupados = {};
        data.forEach((c) => {
          if (!agrupados[c.hospital]) agrupados[c.hospital] = [];
          agrupados[c.hospital].push(c);
        });
        setComentarios(agrupados);
      })
      .catch(console.error);
  }, []);

  const handleComentarioChange = (hospitalId, texto) => {
    setNovosComentarios({ ...novosComentarios, [hospitalId]: texto });
  };

  const handleEnviarComentario = async (hospitalId) => {
    if (!usuario) {
      setErro(true);
      setMensagem("⚠️ Você precisa estar logado para comentar.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/comentarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospital: hospitalId,
          usuario: usuario.id,
          texto: novosComentarios[hospitalId],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const atualizados = { ...comentarios };
        atualizados[hospitalId] = [...(comentarios[hospitalId] || []), data];
        setComentarios(atualizados);
        setNovosComentarios({ ...novosComentarios, [hospitalId]: "" });
        setErro(false);
        setMensagem("✅ Comentário enviado com sucesso!");
      } else {
        throw new Error("Erro ao enviar comentário.");
      }
    } catch (err) {
      console.error(err);
      setErro(true);
      setMensagem("❌ Erro ao enviar o comentário.");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Hospitais Cadastrados
      </Typography>

      {mensagem && (
        <Box mb={2}>
          <Alert severity={erro ? "error" : "success"}>{mensagem}</Alert>
        </Box>
      )}

      {hospitais.map((hospital) => (
        <Card key={hospital.codigo} sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            {hospital.imagem && (
              <CardMedia
                component="img"
                height="200"
                image={`http://127.0.0.1:8000/${hospital.imagem}`}
                alt={hospital.nome}
                sx={{ mb: 2 }}
              />
            )}

            <Typography variant="h5" gutterBottom>
              {hospital.nome}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {hospital.descricao}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column" gap={1}>
              <Typography><strong>Endereço:</strong> {hospital.endereco}</Typography>
              <Typography><strong>Funcionamento:</strong> {hospital.hora_funcionamento}</Typography>
              <Typography><strong>Telefone:</strong> <Link href={`tel:${hospital.telefone}`}>{hospital.telefone}</Link></Typography>
              <Typography><strong>Email:</strong> <Link href={`mailto:${hospital.email}`}>{hospital.email}</Link></Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2"><strong>Especialidades:</strong></Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {hospital.especialidades.split(",").map((e, i) => (
                  <Chip key={i} label={e.trim()} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2"><strong>Comentários:</strong></Typography>
              {(comentarios[hospital.codigo] || []).map((c, i) => (
                <Typography key={i} sx={{ mt: 1, ml: 1 }}>
                  🗨 <strong>{c.usuario_username || "Usuário"}:</strong> {c.texto}
                </Typography>
              ))}

              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Deixe seu comentário"
                  fullWidth
                  multiline
                  minRows={2}
                  value={novosComentarios[hospital.codigo] || ""}
                  onChange={(e) => handleComentarioChange(hospital.codigo, e.target.value)}
                  disabled={!usuario}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleEnviarComentario(hospital.codigo)}
                  disabled={!usuario || !novosComentarios[hospital.codigo]}
                >
                  Enviar
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
