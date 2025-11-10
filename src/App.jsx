import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
  Stack,
  Link,
  Divider,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function MintKitchenMenu() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const contactStyle = {
    textTransform: 'capitalize',
    fontSize: '0.8rem',
  };

  const iconStyle = {
    color: 'text.secondary',
    fontSize: 16,
  };

  const logoUrl =
    'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/green-and-pink-modern-indian-restaurant-logo-high-8atjar.png?enable-io=true&width=200';

  const logoAnimation = {
    opacity: 0,
    transform: 'translateY(-10px)',
    animation: 'fadeInLogo 1s ease forwards',
  };

  const keyframes = `@keyframes fadeInLogo {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }`;

  const menuData = {
    dosas: [
      { name: 'Ghee Dosa', description: 'Thin and crispy dosa made from fermented rice-lentil batter, cooked with pure ghee for a rich, golden finish. Served with chutney & sambar.', price: '$6.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/image-high.png?enable-io=true&enable=upscale&crop=1202,1272,x0,y164,safe&width=275&height=291' },
      { name: 'Masala Dosa', description: 'Crisp dosa filled with a mildly spiced potato-onion masala. Made with fermented batter for soft inner layers and crispy edges. Served with chutney & sambar.', price: '$8.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152034-high.jpg?enable-io=true&enable=upscale&crop=1399,1536,x261,y0,safe&width=275&height=302' },
      { name: 'Mysore Masala Dosa', description: 'Dosa spread with a tangy red chutney and stuffed with spiced potato masala. Made from fermented batter and cooked to a golden crisp.', price: '$8.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152033-high.jpg?enable-io=true&enable=upscale&crop=1536,1536,x192,y0,safe&width=239&height=239' },
    ],
    biryanis: [
      { name: 'Chicken Biryani', description: 'Aromatic basmati rice layered with marinated chicken, herbs, saffron, and whole spices, cooked dum-style.', price: '$14.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152037-high.jpg?enable-io=true&enable=upscale&crop=1536,1536,x192,y0,safe&width=264&height=264' },
      { name: 'Mutton Biryani', description: 'Slow-cooked tender mutton and fragrant rice infused with robust spices for deep flavor.', price: '$16.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152032-high.jpg?enable-io=true&enable=upscale&crop=1829,1536,x46,y0,safe&width=250&height=210' },
      { name: 'Paneer Biryani', description: 'Cubes of paneer and veggies layered with spiced basmati rice—hearty, vegetarian, and aromatic.', price: '$14.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152032-high-ap8wfh.jpg?enable-io=true&enable=upscale&crop=1592,1536,x164,y0,safe&width=228&height=220' },
    ],
    curries: [
      { name: 'Butter Chicken', description: 'Tender chicken simmered in a creamy tomato-butter sauce with mild North-Indian spices.', price: '$15.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152035-high.jpg?enable-io=true&enable=upscale&crop=1536,1536,x192,y0,safe&width=232&height=232' },
      { name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a rich, buttery tomato gravy, lightly spiced.', price: '$16.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152040-high.jpg?enable-io=true&enable=upscale&crop=1794,1536,x63,y0,safe&width=216&height=185' },
      { name: 'Chicken Curry (Coconut Milk)', description: 'Chicken stewed in a coconut-milk curry with onions, tomatoes, and coastal spices.', price: '$16.00', image: 'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/1000152030-high.jpg?enable-io=true&enable=upscale&crop=1414,1536,x258,y0,safe&width=208&height=226' },
    ],
  };

  const renderMenuItems = (items) => (
    <Grid container columns={12} spacing={2}>
      {items.map((dish) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={dish.name}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
              position: 'relative',
            }}
          >
            <CardMedia
              component="img"
              image={dish.image}
              alt={dish.name}
              sx={{ height: 220, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
            <CardContent>
              <Typography variant="h6">{dish.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {dish.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', ml: 1 }}>
                {dish.price}
              </Typography>
              <Button
                variant="contained"
                href="https://mint-kitchen.square.site"
                target="_blank"
                sx={{ 
                  position: 'sticky', 
                  bottom: 10, 
                  fontSize: '0.8rem', 
                  textTransform: 'none',
                  bgcolor: '#75d72c',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#5fb824',
                  }
                }}
              >
                Order Online
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
      <style>{keyframes}</style>
      
      {/* Header with Logo */}
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

      {/* Hero Section */}
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
        {/* Logo Overlay */}
        {/* <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            display: 'flex',
            alignItems: 'center',
            animation: logoAnimation.animation,
          }}
        >
          <img
            src={logoUrl}
            alt="Mint Kitchen Logo"
            style={{ width: 100, borderRadius: 4, ...logoAnimation }}
          />
          <Typography
            sx={{
              fontFamily: 'Kaushan Script, cursive',
              fontSize: '150%',
              fontWeight: 'bold',
              color: '#75d72c',
              marginLeft: '8px',
              ...logoAnimation,
            }}
          >
            Mint Kitchen
          </Typography>
        </Box> */}

        <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', p: 3, borderRadius: 2 }}>
          <Typography variant="h3" fontWeight="bold">
            Bringing Authentic South Indian Flavors to Charlottesville
          </Typography>
        </Box>
      </Box>

      {/* Intro Section */}
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
        <Button
          variant="contained"
          href="https://mint-kitchen.square.site"
          target="_blank"
          sx={{ 
            mt: 2,
            bgcolor: '#75d72c',
            color: '#fff',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: '#5fb824',
            }
          }}
        >
          Order Online
        </Button>
      </Container>

      {/* Menu Section */}
      <Box sx={{ mt: 4 }}>
        <AppBar position="sticky" sx={{ top: 0, bgcolor: '#1b5e20', boxShadow: 3 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Our Menu
            </Typography>
          </Toolbar>
          <Tabs 
            value={tabIndex} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            textColor="inherit" 
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#75d72c',
                height: 3,
              },
            }}
          >
            <Tab label="Dosas" sx={{ fontWeight: 'bold' }} />
            <Tab label="Biryanis" sx={{ fontWeight: 'bold' }} />
            <Tab label="Curries" sx={{ fontWeight: 'bold' }} />
          </Tabs>
        </AppBar>

        {tabIndex === 0 && <Box p={3} sx={{ bgcolor: '#fafafa' }}>{renderMenuItems(menuData.dosas)}</Box>}
        {tabIndex === 1 && <Box p={3} sx={{ bgcolor: '#fafafa' }}>{renderMenuItems(menuData.biryanis)}</Box>}
        {tabIndex === 2 && <Box p={3} sx={{ bgcolor: '#fafafa' }}>{renderMenuItems(menuData.curries)}</Box>}
      </Box>

      {/* Contact Section */}
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
    </Box>
  );
}
