import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import FloatingCartButton from './components/FloatingCartButton';

// Lazy load heavy components
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CartModal = lazy(() => import('./components/CartModal'));

export default function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper' }}>
        <Suspense fallback={<Box sx={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>

          {/* Floating Cart Button - shown on all pages */}
          <FloatingCartButton />

          {/* Cart Modal - shown on all pages */}
          <CartModal />
        </Suspense>
      </Box>
    </Router>
  );
}
