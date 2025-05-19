import React, { useState } from "react";
import { Box, Modal, Typography, Button, Divider, Rating, TextField, Alert, Grid } from "@mui/material";

export default function HospitalModal({
                                          open,
                                          onClose,
                                          hospital,
                                          comentarios,
                                          novaNota,
                                          setNovaNota,
                                          novoComentario,
                                          setNovoComentario,
                                          handleEnviarComentario,
                                          mensagem,
                                          erro,
                                          usuario,
                                          handleComoChegar,
                                      }) {
    const [comentariosVisiveis, setComentariosVisiveis] = useState(5);

    const mediaEstrelas = comentarios.length > 0
        ? comentarios.reduce((acc, c) => acc + c.estrelas, 0) / comentarios.length
        : 0;

    const handleMostrarMais = () => {
        setComentariosVisiveis((prev) => prev + 5);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
                    maxHeight: "90vh",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Grid container>
                    {/* Hospital Info */}
                    <Grid item xs={12} md={6} sx={{ p: 3, overflowY: "auto" }}>
                        {hospital && (
                            <>
                                {hospital.imagem && (
                                    <Box
                                        component="img"
                                        src={`http://127.0.0.1:8000/${hospital.imagem}`}
                                        alt={hospital.nome}
                                        sx={{
                                            width: "100%",
                                            height: 180,
                                            objectFit: "cover",
                                            borderRadius: 2,
                                            mb: 2,
                                        }}
                                    />
                                )}
                                <Typography variant="h6">{hospital.nome}</Typography>
                                <Typography>{hospital.descricao}</Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>Endereço:</strong> {hospital.endereco}
                                </Typography>
                                <Typography>
                                    <strong>Telefone:</strong> {hospital.telefone}
                                </Typography>
                                <Typography>
                                    <strong>Email:</strong> {hospital.email}
                                </Typography>
                                <Typography>
                                    <strong>Funcionamento:</strong> {hospital.hora_funcionamento}
                                </Typography>
                                <Typography>
                                    <strong>Especialidades:</strong> {hospital.especialidades}
                                </Typography>
                            </>
                        )}
                    </Grid>

                    {/* Comentários */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            p: 3,
                            borderLeft: { md: "1px solid #ddd" },
                        }}
                    >
                        <Typography variant="h6">Comentários</Typography>


                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                                <Rating value={mediaEstrelas} readOnly precision={0.5} />
                                <Typography variant="body2" color="text.secondary">
                                    ({comentarios.length} {comentarios.length === 1 ? "avaliação" : "avaliações"})
                                </Typography>
                            </Box>


                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
                            {comentarios.slice(0, comentariosVisiveis).map((c, i) => (
                                <Box key={i} sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>{c.usuario_username || "Usuário"}:</strong>
                                    </Typography>
                                    <Typography variant="body1">{c.texto}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ⭐ {c.estrelas}/5
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            ))}
                        </Box>

                        {comentariosVisiveis < comentarios.length && (
                            <Button
                                variant="text"
                                onClick={handleMostrarMais}
                                sx={{ mt: 2 }}
                            >
                                Mostrar mais
                            </Button>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Deixe sua avaliação:
                            </Typography>
                            <Rating
                                name="avaliacao"
                                value={novaNota}
                                onChange={(e, newValue) => setNovaNota(newValue)}
                            />
                            <TextField
                                label="Deixe seu comentário (opcional)"
                                fullWidth
                                multiline
                                minRows={2}
                                sx={{ mt: 1 }}
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                                disabled={!usuario}
                            />

                            {!usuario && (
                                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                    Você precisa estar logado para comentar ou avaliar.
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

                            {/* Botão para rota */}

                                <Button onClick={handleComoChegar}>Como chegar</Button>


                        </Box>
                    </Grid>
                </Grid>

                <Button variant="text" onClick={onClose} sx={{ mt: 2 }}>
                    Fechar
                </Button>
            </Box>
        </Modal>
    );
}
