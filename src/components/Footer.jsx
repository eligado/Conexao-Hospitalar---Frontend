import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box component="footer" sx={{ textAlign: "center", py: 2, bgcolor: "#f5f5f5", mt: "auto" }}>
            <Typography variant="body2">&copy; 2023-2025 Conexão Hospitalar</Typography>
        </Box>
    );
}
