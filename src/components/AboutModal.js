import { Box, Button, Modal, Typography } from "@mui/material";
                        import { useState } from "react";

                        export default function AboutModal() {
                            const [open, setOpen] = useState(false);

                            const handleOpen = () => setOpen(true);
                            const handleClose = () => setOpen(false);

                            return (
                                <Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleOpen}
                                        sx={{
                                            position: "fixed",
                                            bottom: 16,
                                            left: 16,
                                            zIndex: 1300,
                                            background: "linear-gradient(45deg, #2196f3, #21cbf3)",
                                            color: "white",
                                            fontWeight: "bold",
                                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        Saiba Mais
                                    </Button>

                                    <Modal open={open} onClose={handleClose}>
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                width: "90%",
                                                maxWidth: 600,
                                                bgcolor: "white",
                                                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                                                p: { xs: 2, sm: 4 }, // Adjust padding for smaller screens
                                                borderRadius: "16px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Typography
                                                variant="h5"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: "bold",
                                                    textAlign: "center",
                                                    color: "#1976d2",
                                                    mb: { xs: 1, sm: 2 }, // Adjust margin for smaller screens
                                                }}
                                            >
                                                Sobre o Conexão Hospitalar
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    lineHeight: 1.8,
                                                    color: "#555",
                                                    fontSize: { xs: "0.9rem", sm: "1rem" }, // Adjust font size for smaller screens
                                                }}
                                            >
                                                O site Conexão Hospitalar foi criado com o objetivo de facilitar o acesso às unidades de saúde na região de Manaus. Através de um mapa interativo, é possível localizar rapidamente instituições como UPAs (Unidades de Pronto Atendimento), UBSs (Unidades Básicas de Saúde), SPAs (Serviços de Pronto Atendimento) e hospitais.
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    lineHeight: 1.8,
                                                    color: "#555",
                                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                                }}
                                            >
                                                A proposta central do projeto é promover mais transparência e agilidade para quem precisa de atendimento médico, evitando deslocamentos desnecessários e ajudando na tomada de decisão sobre para onde ir. O site também permite um melhor conhecimento das estruturas e dos serviços prestados por cada unidade, seja para uma consulta de rotina, atendimento de emergência ou orientações sobre saúde.
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    lineHeight: 1.8,
                                                    color: "#555",
                                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                                }}
                                            >
                                                Cada ponto no mapa representa uma unidade e, ao interagir com ele, o usuário pode acessar informações detalhadas sobre o local, incluindo dados como horário de funcionamento, se a unidade está atualmente aberta, endereço completo, contatos, especialidades atendidas e até mesmo uma breve descrição do tipo de atendimento oferecido.
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    lineHeight: 1.8,
                                                    color: "#555",
                                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                                }}
                                            >
                                                O Conexão Hospitalar foi pensado para ser simples de usar, acessível e útil para todos, buscando ser uma ponte entre os cidadãos e o sistema de saúde, reforçando a importância do acesso à informação como forma de cuidado e prevenção.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleClose}
                                                sx={{
                                                    display: "block",
                                                    margin: "16px auto 0",
                                                    background: "linear-gradient(45deg, #2196f3, #21cbf3)",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                    width: { xs: "100%", sm: "auto" }, // Full width on smaller screens
                                                }}
                                            >
                                                Fechar
                                            </Button>
                                        </Box>
                                    </Modal>
                                </Box>
                            );
                        }