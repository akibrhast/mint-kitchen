import React from 'react';
import { Box, Typography } from '@mui/material';

const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '60vh',
        backgroundImage: 'url(https://primary.jwwb.nl/pexels/87/877220.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', p: 3, borderRadius: 2 }}>
        <Typography variant="h3" fontWeight="bold">
          Bringing Authentic South Indian Flavors to Charlottesville
        </Typography>
      </Box>
    </Box>
  );
};

export default Hero;
