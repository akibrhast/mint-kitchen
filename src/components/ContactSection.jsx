import React from 'react';
import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ContactSection = () => {
  return (
    <Box sx={{ py: 3, backgroundColor: '#1b5e20', color: 'white', mt: 0 }}>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ flexWrap: 'wrap' }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
              221 Carlton Road, Suite 1, Charlottesville, VA 22902
            </Typography>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'rgba(255,255,255,0.3)' }} />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PhoneIcon sx={{ fontSize: 16 }} />
            <Link href="tel:+14342296121" underline="hover" color="inherit" sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
              (434) 229-6121
            </Link>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, borderColor: 'rgba(255,255,255,0.3)' }} />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <EmailIcon sx={{ fontSize: 16 }} />
            <Link href="mailto:mintkitchen25@gmail.com" underline="hover" color="inherit" sx={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
              mintkitchen25@gmail.com
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ContactSection;
