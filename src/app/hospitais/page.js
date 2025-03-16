"use client";
import { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Box,
    Divider,
    Link
} from "@mui/material";

export default function Page() {
    const [hospitais, setHospitais] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/hospitais/")
            .then((response) => response.json())
            .then((data) => {
                setHospitais(data);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados:", error);
            });
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Hospitais Cadastrados
            </Typography>

            {hospitais.map((hospital) => (
                <Card key={hospital.codigo} sx={{ mb: 3, boxShadow: 3 }}>
                    <CardContent>
                        {hospital.imagem && (
                            <CardMedia
                                component="img"
                                height="200"
                                image={`http://localhost:8000/${hospital.imagem}`}
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
                            <Typography><strong>Horário de Funcionamento:</strong> {hospital.hora_funcionamento}</Typography>
                            <Typography>
                                <strong>Telefone:</strong>{" "}
                                <Link href={`tel:${hospital.telefone}`}>{hospital.telefone}</Link>
                            </Typography>
                            <Typography>
                                <strong>Email:</strong>{" "}
                                <Link href={`mailto:${hospital.email}`}>{hospital.email}</Link>
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2"><strong>Especialidades:</strong></Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {hospital.especialidades.split(',').map((especialidade, index) => (
                                    <Chip
                                        key={index}
                                        label={especialidade.trim()}
                                        size="small"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
}
