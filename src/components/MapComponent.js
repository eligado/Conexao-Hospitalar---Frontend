import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HospitalModal from "./HospitalModal";

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
    const storedUsuario = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    const storedToken = localStorage.getItem("access") || sessionStorage.getItem("access");

    setUsuario(storedUsuario ? JSON.parse(storedUsuario) : null);
    setToken(storedToken || null);
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

  const resetModal = () => {
    setNovoComentario("");
    setNovaNota(0);
    setMensagem("");
    setErro(false);
    setHospitalSelecionado(null);
  };

  const handleFecharModal = () => {
    resetModal();
    setModalAberto(false);
  };

  const handleEnviarComentario = async () => {
    if (!usuario || !token) {
      setErro(true);
      setMensagem("Você precisa estar logado para comentar ou avaliar.");
      return;
    }

    if (novaNota === 0 && novoComentario.trim() !== "") {
      setErro(true);
      setMensagem("Para enviar um comentário, você precisa dar uma nota.");
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

        <HospitalModal
            open={modalAberto}
            onClose={handleFecharModal}
            hospital={hospitalSelecionado}
            comentarios={comentarios}
            novaNota={novaNota}
            setNovaNota={setNovaNota}
            novoComentario={novoComentario}
            setNovoComentario={setNovoComentario}
            handleEnviarComentario={handleEnviarComentario}
            mensagem={mensagem}
            erro={erro}
            usuario={usuario}
        />
      </>
  );
}
