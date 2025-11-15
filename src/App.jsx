import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import FloatingCartButton from './components/FloatingCartButton';
import CartModal from './components/CartModal';

export default function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        {/* Floating Cart Button - shown on all pages */}
        <FloatingCartButton />

        {/* Cart Modal - shown on all pages */}
        <CartModal />
      </Box>
    </Router>
  );
}
