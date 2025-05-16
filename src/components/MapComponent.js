import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Box, Modal, Typography, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const containerStyle = {
    width: '100vw',
    height: '100vh',
};

const center = {
    lat: -3.119028,
    lng: -60.021731,
};

const mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    styles: [
        {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
        },
    ],
};

export default function MapaHospitais() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDYy0bWIoQF8NLmjVMcuYwBXGNtGK76dUw',
    });

    const [hospitais, setHospitais] = useState([]);
    const [hospitalSelecionado, setHospitalSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [termoPesquisa, setTermoPesquisa] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/api/hospitais/')
            .then((response) => response.json())
            .then((data) => {
                setHospitais(data);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    const hospitaisFiltrados = hospitais.filter((hospital) =>
        hospital.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        hospital.especialidades.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

    if (loadError) return <div>Erro ao carregar o mapa</div>;
    if (!isLoaded) return <div>Carregando mapa...</div>;

    return (
        <>
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1, width: '300px' }}>
                <TextField
                    label="Pesquisar"
                    variant="outlined"
                    size="small"
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 1,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        border: '1px solid #ccc',
                    }}
                />
            </Box>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                options={mapOptions}
            >
                {hospitaisFiltrados.map((hospital) => (
                    <Marker
                        key={hospital.codigo}
                        position={{ lat: hospital.latitude, lng: hospital.longitude }}
                        onClick={() => {
                            setHospitalSelecionado(hospital);
                            setModalAberto(true);
                        }}
                    />
                ))}
            </GoogleMap>

            <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 0,
                        overflow: 'hidden',
                    }}
                >
                    {hospitalSelecionado && (
                        <>
                            {/* Image covering the top */}
                            {hospitalSelecionado.imagem && (
                                <Box
                                    component="img"
                                    src={`http://127.0.0.1:8000/${hospitalSelecionado.imagem}`}
                                    alt={hospitalSelecionado.nome}
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover',
                                    }}
                                />
                            )}

                            {/* Close button */}
                            <Button
                                onClick={() => setModalAberto(false)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    minWidth: 'auto',
                                    padding: 0,
                                    color: 'white',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    },
                                }}
                            >
                                &#x2715;
                            </Button>

                            {/* Modal content */}
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h6" component="h2">
                                    {hospitalSelecionado.nome}
                                </Typography>
                                <Typography sx={{ mt: 2 }}>
                                    {hospitalSelecionado.descricao}
                                </Typography>
                                <Typography sx={{ mt: 2 }}>
                                    <strong>Endereço:</strong> {hospitalSelecionado.endereco}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>Telefone:</strong> {hospitalSelecionado.telefone}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>Email:</strong> {hospitalSelecionado.email}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>Horário de Funcionamento:</strong> {hospitalSelecionado.hora_funcionamento}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>Especialidades:</strong> {hospitalSelecionado.especialidades}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setModalAberto(false)}
                                    sx={{ mt: 2 }}
                                >
                                    Fechar
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );
}