"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function ResponsiveAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const userData = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUsuario(null);
    handleClose();
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
    >
      <Tooltip title={usuario ? "Perfil" : "Entrar / Registrar-se"}>
        <IconButton onClick={handleClick} sx={{ p: 0 }}>
          <Avatar>
            {usuario ? usuario.username.charAt(0).toUpperCase() : "L"}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {usuario
          ? [
              <MenuItem key="usuario" disabled>
                <Box sx={{ color: "gray" }}>
                  Logado como <strong>{usuario.username}</strong>
                </Box>
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                <Box sx={{ textDecoration: "none", color: "inherit" }}>
                  Sair
                </Box>
              </MenuItem>,
            ]
          : [
              <MenuItem key="login" onClick={handleClose}>
                <Link href="/login" style={{ textDecoration: "none", color: "inherit" }}>
                  Entrar
                </Link>
              </MenuItem>,
              <MenuItem key="register" onClick={handleClose}>
                <Link href="/register" style={{ textDecoration: "none", color: "inherit" }}>
                  Registrar-se
                </Link>
              </MenuItem>,
            ]}
      </Menu>
    </Box>
  );
}
