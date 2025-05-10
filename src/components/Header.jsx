"use client"
import Link from "next/link";

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function ResponsiveAppBar() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: (theme) => theme.zIndex.appBar + 1,
            }}
        >
            <Tooltip title="Entrar / Registrar-se">
                <IconButton onClick={handleClick} sx={{p: 0}}>
                    <Avatar alt="Login" src="/static/images/avatar/2.jpg"/>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Link href="/login" passHref>
                    <MenuItem onClick={handleClose}>
                        <Box sx={{textDecoration: 'none', color: 'inherit'}}>
                            Entrar
                        </Box>
                    </MenuItem>
                </Link>
                <Link href="/register" passHref>
                    <MenuItem onClick={handleClose}>
                        <Box sx={{textDecoration: 'none', color: 'inherit'}}>
                            Registrar-se
                        </Box>
                    </MenuItem>
                </Link>

            </Menu>
        </Box>
    );
}
