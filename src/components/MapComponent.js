import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HospitalModal from "./HospitalModal";

const containerStyle = { width: "100vw", height: "100vh" };
const defaultCenter = { lat: -3.119028, lng: -60.021731 };
const mapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
  clickableIcons: false,
};

export default function MapaHospitais() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDYy0bWIoQF8NLmjVMcuYwBXGNtGK76dUw",
  });

  // Estados de dados
  const [hospitais, setHospitais] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [hospitalSelecionado, setHospitalSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [campoBusca, setCampoBusca] = useState("nome");
  const [comentariosPorHospital, setComentariosPorHospital] = useState({});
  const [novoComentario, setNovoComentario] = useState("");
  const [novaNota, setNovaNota] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  // Estado de rota
  const [directions, setDirections] = useState(null);

  // Carrega usuário e token
  useEffect(() => {
    const storedUsuario = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    const storedToken = localStorage.getItem("access") || sessionStorage.getItem("access");

    setUsuario(storedUsuario ? JSON.parse(storedUsuario) : null);
    setToken(storedToken || null);
  }, []);

  // Obter localização do usuário via Geolocation API
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: -3.098625526978621, lng: -60.02400677195674 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: -3.098625526978621, lng: -60.02400677195674 }),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Carrega lista de hospitais
  useEffect(() => {
    fetch("http://localhost:8000/api/hospitais/")
        .then((res) => res.json())
        .then((data) => setHospitais(data))
        .catch(console.error);
  }, []);

  // Busca comentários de um hospital
  const buscarComentarios = (codigo) => {
    fetch(`http://localhost:8000/api/hospitais/${codigo}/comentarios/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setComentariosPorHospital((prev) => ({ ...prev, [codigo]: data }));
          }
        })
        .catch(console.error);
  };

  // Abre modal e carrega comentários
  const handleAbrirModal = (hospital) => {
    setHospitalSelecionado(hospital);
    setModalAberto(true);
    buscarComentarios(hospital.codigo);
    setMensagem("");
    setErro(false);
    setNovoComentario("");
    setNovaNota(0);
  };

  // Fecha modal e reseta estado
  const handleFecharModal = () => {
    setModalAberto(false);
    setHospitalSelecionado(null);
    setMensagem("");
    setErro(false);
    setNovoComentario("");
    setNovaNota(0);
  };

  // Solicita rota e fecha modal
  const handleComoChegar = useCallback(() => {
    if (!userLocation || !hospitalSelecionado) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
        {
          origin: userLocation,
          destination: { lat: hospitalSelecionado.latitude, lng: hospitalSelecionado.longitude },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        }
    );
    handleFecharModal();
  }, [userLocation, hospitalSelecionado]);

  // Envia novo comentário
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
      const res = await fetch(
          `http://localhost:8000/api/hospitais/${hospitalSelecionado.codigo}/comentarios/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ texto: novoComentario, estrelas: novaNota }),
          }
      );
      const data = await res.json();
      if (res.ok) {
        const atuais = comentariosPorHospital[hospitalSelecionado.codigo] || [];
        setComentariosPorHospital((prev) => ({ ...prev, [hospitalSelecionado.codigo]: [...atuais, data] }));
        setNovoComentario("");
        setNovaNota(0);
        setErro(false);
        setMensagem("✅ Comentário/avaliação enviada com sucesso!");
      } else {
        throw new Error(data.detail || "Erro ao enviar");
      }
    } catch {
      setErro(true);
      setMensagem("❌ Erro ao enviar comentário ou avaliação.");
    }
  };

  // Filtra hospitais por termo e campo
  const filtrarHospital = (hospital) => {
    const termo = termoPesquisa.toLowerCase();
    return campoBusca === "nome"
        ? hospital.nome.toLowerCase().includes(termo)
        : hospital.especialidades.toLowerCase().includes(termo);
  };

  if (loadError) return <div>Erro ao carregar o mapa</div>;
  if (!isLoaded) return <div>Carregando mapa...</div>;

  const comentarios = hospitalSelecionado ? comentariosPorHospital[hospitalSelecionado.codigo] || [] : [];

  return (
      <>
        <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 1, width: 300, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
              label="Pesquisar"
              variant="outlined"
              size="medium"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 6px 12px rgba(0,0,0,0.15)", border: "1px solid #ddd" }}
          />
          <FormControl size="medium" sx={{ backgroundColor: "#fff", borderRadius: 2, width: "55%", boxShadow: "0 6px 12px rgba(0,0,0,0.15)" }}>
            <InputLabel id="campo-busca-label" sx={{ color: "#333", fontWeight: "bold" }}>Pesquisar por</InputLabel>
            <Select
                labelId="campo-busca-label"
                value={campoBusca}
                label="Pesquisar por"
                onChange={(e) => setCampoBusca(e.target.value)}
                sx={{ height: 40 }}
            >
              <MenuItem value="nome">Nome</MenuItem>
              <MenuItem value="especialidades">Especialidades</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || defaultCenter}
            zoom={userLocation ? 15 : 13}
            options={mapOptions}
        >
          {userLocation && (
              <Marker position={userLocation} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
          )}

          {hospitais.filter(filtrarHospital).map((h) => (
              <Marker key={h.codigo} position={{ lat: h.latitude, lng: h.longitude }} onClick={() => handleAbrirModal(h)} />
          ))}

          {/* Renderizar rota quando disponível */}
          {directions && (
                <DirectionsRenderer
                directions={directions}
                options={{ suppressMarkers: true }}
              />
            )}
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
            handleComoChegar={handleComoChegar}
            mensagem={mensagem}
            erro={erro}
            usuario={usuario}
            userLocation={userLocation}
        />
      </>
  );
}
