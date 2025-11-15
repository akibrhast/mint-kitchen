import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = ({ logoUrl }) => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#1b5e20', boxShadow: 2 }}>
      <Toolbar sx={{ py: 1, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img
            src={logoUrl}
            alt="Mint Kitchen Logo"
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Kaushan Script, cursive',
              fontWeight: 'bold',
              color: '#75d72c',
              letterSpacing: 1,
            }}
          >
            Mint Kitchen
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
