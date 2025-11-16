import React from 'react';
import { Container, Typography, Button } from '@mui/material';

const IntroSection = ({ usingSquareData }) => {
  return (
    <Container sx={{ py: 5, textAlign: 'center', bgcolor: '#fffbf0', position: 'relative', zIndex: 1, color: '#333' }}>
      <Typography variant="h5" gutterBottom>
        At Mint Kitchen, we take pride in serving fresh, flavorful South Indian cuisine made with high-quality ingredients and time-honored recipes.
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', mb: 4, color: '#666' }}>
        Every dish is crafted with care to capture the rich traditions and vibrant taste of South India.
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        We are a takeout-only restaurant, open during the following hours:
      </Typography>
      <Typography variant="body2">Thursday: 5:00 p.m - 8:00 p.m</Typography>
      <Typography variant="body2">Friday (Dosa Night): 5:00 p.m – 8:00 p.m</Typography>
      <Typography variant="body2">Saturday: 12:00 p.m – 7:00 p.m</Typography>

    </Container>
  );
};

export default IntroSection;
