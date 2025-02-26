"use client"
import { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Box } from "@mui/material";

export default function Home() {
  const [hospitais, setHospitais] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetch("http://localhost:8000/api/hospitais/") // URL correta da sua API
        .then((response) => response.json())
        .then((data) => setHospitais(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    ); // Indicador de carregamento
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Lista de Hospitais
      </Typography>
      <List>
        {hospitais.map((hospital) => (
          <ListItem key={hospital.codigo}>
            <ListItemText primary={<Typography color="secondary">{hospital.nome}</Typography>} /> {/* Substitua 'codigo' e 'nome' pelos campos corretos */}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
