import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { fetchMenuData } from '../services/api';
import Header from '../components/Header';
import Hero from '../components/Hero';
import IntroSection from '../components/IntroSection';
import MenuSection from '../components/MenuSection';
import ContactWithOptions from '../components/ContactSection';
import Divider from '@mui/material/Divider';

export default function HomePage() {
  const [tabIndex, setTabIndex] = React.useState(0);

  // State for API data
  const [menuData, setMenuData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [usingSquareData, setUsingSquareData] = React.useState(false);

  // Fetch menu data from API on component mount
  React.useEffect(() => {
    const loadMenuData = async () => {
      setLoading(true);
      const { data, error } = await fetchMenuData();

      if (data) {
        setMenuData(data);
        setUsingSquareData(true);
        setError(null);
        console.log('Successfully loaded menu from Square API');
      } else {
        console.error('Failed to fetch from API:', error);
        setError(error);
        setMenuData(null);
      }

      setLoading(false);
    };

    loadMenuData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const logoUrl =
    'https://primary.jwwb.nl/public/u/j/n/temp-bowwtiiwxiqnvhtdgcyg/green-and-pink-modern-indian-restaurant-logo-high-8atjar.png?enable-io=true&width=200';

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
      {/* Header with Logo */}
      <Header logoUrl={logoUrl} />

      {/* Hero Section */}
      <Hero />

      {/* Intro Section */}
      <IntroSection usingSquareData={usingSquareData} />

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

        {loading && (
          <Box p={3} sx={{ bgcolor: '#fafafa', textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              Loading menu items...
            </Typography>
          </Box>
        )}

        {error && !loading && (
          <Box p={3} sx={{ bgcolor: '#fafafa', textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              No items currently available for sale
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please check back later or contact us for availability
            </Typography>
          </Box>
        )}

        {!loading && !error && menuData && (
          <>
            {tabIndex === 0 && (
              <Box p={3} sx={{ bgcolor: '#fafafa' }}>
                {menuData.dosas && menuData.dosas.length > 0 ? (
                  <MenuSection items={menuData.dosas} />
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    No dosas available at this time
                  </Typography>
                )}
              </Box>
            )}
            {tabIndex === 1 && (
              <Box p={3} sx={{ bgcolor: '#fafafa' }}>
                {menuData.biryanis && menuData.biryanis.length > 0 ? (
                  <MenuSection items={menuData.biryanis} />
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    No biryanis available at this time
                  </Typography>
                )}
              </Box>
            )}
            {tabIndex === 2 && (
              <Box p={3} sx={{ bgcolor: '#fafafa' }}>
                {menuData.curries && menuData.curries.length > 0 ? (
                  <MenuSection items={menuData.curries} />
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    No curries available at this time
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Contact Section */}
      <Divider />
      <ContactWithOptions />
    </Box>
  );
}
