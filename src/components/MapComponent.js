"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Box, Modal, Typography, Button, TextField, InputAdornment, Alert, Rating } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const containerStyle = { width: "100vw", height: "100vh" };
const center = { lat: -3.119028, lng: -60.021731 };
const mapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
};

export default function MapaHospitais() {
  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: "AIzaSyDYy0bWIoQF8NLmjVMcuYwBXGNtGK76dUw" });

  const [hospitais, setHospitais] = useState([]);
  const [hospitalSelecionado, setHospitalSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [comentariosPorHospital, setComentariosPorHospital] = useState({});
  const [novoComentario, setNovoComentario] = useState("");
  const [novaNota, setNovaNota] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsuario = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
      const storedToken = localStorage.getItem("access") || sessionStorage.getItem("access");

      setUsuario(storedUsuario ? JSON.parse(storedUsuario) : null);
      setToken(storedToken || null);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/hospitais/")
      .then((res) => res.json())
      .then(setHospitais)
      .catch(console.error);
  }, []);

  const buscarComentarios = (codigo) => {
    fetch(`http://localhost:8000/api/hospitais/${codigo}/comentarios/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setComentariosPorHospital((prev) => ({
            ...prev,
            [codigo]: data,
          }));
        } else {
          console.warn("Resposta inesperada:", data);
        }
      })
      .catch(console.error);
  };

  const handleAbrirModal = (hospital) => {
    setHospitalSelecionado(hospital);
    setModalAberto(true);
    buscarComentarios(hospital.codigo);
    setMensagem("");
    setErro(false);
    setNovoComentario("");
    setNovaNota(0);
  };

  const handleEnviarComentario = async () => {
    if (!usuario || !token) {
      setErro(true);
      setMensagem("⚠️ Você precisa estar logado para comentar ou avaliar.");
      return;
    }

    if (novaNota === 0 && novoComentario.trim() !== "") {
      setErro(true);
      setMensagem("⚠️ Para enviar um comentário, você precisa dar uma nota.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/hospitais/${hospitalSelecionado.codigo}/comentarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          texto: novoComentario,
          estrelas: novaNota,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const atualizados = comentariosPorHospital[hospitalSelecionado.codigo] || [];
        setComentariosPorHospital((prev) => ({
          ...prev,
          [hospitalSelecionado.codigo]: [...atualizados, data],
        }));
        setNovoComentario("");
        setNovaNota(0);
        setErro(false);
        setMensagem("✅ Comentário/avaliação enviada com sucesso!");
      } else {
        throw new Error();
      }
    } catch {
      setErro(true);
      setMensagem("❌ Erro ao enviar comentário ou avaliação.");
    }
  };

  const comentarios = comentariosPorHospital[hospitalSelecionado?.codigo] || [];
  const mediaEstrelas = comentarios.length > 0
    ? comentarios.reduce((acc, c) => acc + c.estrelas, 0) / comentarios.length
    : 0;

  if (loadError) return <div>Erro ao carregar o mapa</div>;
  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <>
      <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 1, width: "300px" }}>
        <TextField
          label="Pesquisar"
          variant="outlined"
          size="small"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
          sx={{ backgroundColor: "#f9f9f9", borderRadius: 1, boxShadow: "0 4px 8px rgba(0,0,0,0.2)", border: "1px solid #ccc" }}
        />
      </Box>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15} options={mapOptions}>
        {hospitais
          .filter((h) =>
            h.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
            h.especialidades.toLowerCase().includes(termoPesquisa.toLowerCase())
          )
          .map((hospital) => (
            <Marker
              key={hospital.codigo}
              position={{ lat: hospital.latitude, lng: hospital.longitude }}
              onClick={() => handleAbrirModal(hospital)}
            />
          ))}
      </GoogleMap>

      <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 800, maxHeight: "90vh", bgcolor: "background.paper", borderRadius: 2, boxShadow: 24,
          display: "flex", overflow: "hidden",
        }}>
          {/* Info do hospital */}
          <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
            {hospitalSelecionado && (
              <>
                {hospitalSelecionado.imagem && (
                  <Box component="img" src={`http://127.0.0.1:8000/${hospitalSelecionado.imagem}`} alt={hospitalSelecionado.nome}
                    sx={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 2, mb: 2 }} />
                )}
                <Typography variant="h6">{hospitalSelecionado.nome}</Typography>
                <Typography>{hospitalSelecionado.descricao}</Typography>
                <Typography sx={{ mt: 1 }}><strong>Endereço:</strong> {hospitalSelecionado.endereco}</Typography>
                <Typography><strong>Telefone:</strong> {hospitalSelecionado.telefone}</Typography>
                <Typography><strong>Email:</strong> {hospitalSelecionado.email}</Typography>
                <Typography><strong>Funcionamento:</strong> {hospitalSelecionado.hora_funcionamento}</Typography>
                <Typography><strong>Especialidades:</strong> {hospitalSelecionado.especialidades}</Typography>
              </>
            )}
          </Box>

          {/* Comentários */}
          <Box sx={{ flex: 1, p: 3, borderLeft: "1px solid #ddd", overflowY: "auto" }}>
            <Typography variant="h6">Comentários</Typography>

            {comentarios.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <Rating value={mediaEstrelas} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary">
                  ({comentarios.length} avaliação{comentarios.length > 1 ? "s" : ""})
                </Typography>
              </Box>
            )}

            {comentarios.map((c, i) => (
              <Typography key={i} sx={{ mt: 1 }}>
                🗨 <strong>{c.usuario_username || "Usuário"}:</strong> {c.texto}<br />
                ⭐ {c.estrelas}/5
              </Typography>
            ))}

            <Box sx={{ mt: 2 }}>
              <Rating
                name="avaliacao"
                value={novaNota}
                onChange={(e, newValue) => setNovaNota(newValue)}
              />
              <TextField
                label="Deixe seu comentário (opcional)"
                fullWidth multiline minRows={2}
                sx={{ mt: 1 }}
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                disabled={!usuario}
              />

              {!usuario && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  ⚠️ Você precisa estar logado para comentar ou avaliar.
                </Typography>
              )}

              <Button
                variant="contained"
                sx={{ mt: 1 }}
                fullWidth
                onClick={handleEnviarComentario}
                disabled={!usuario || novaNota === 0}
              >
                Enviar
              </Button>

              {mensagem && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity={erro ? "error" : "success"}>{mensagem}</Alert>
                </Box>
              )}
            </Box>

            <Button variant="text" onClick={() => setModalAberto(false)} sx={{ mt: 2 }}>
              Fechar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
