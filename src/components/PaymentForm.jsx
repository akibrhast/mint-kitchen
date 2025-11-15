import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
  const cardContainerRef = useRef(null);
  const [card, setCard] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const cardInstanceRef = useRef(null);

  const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  useEffect(() => {
    // Skip if already initialized
    if (cardInstanceRef.current) {
      return;
    }

    const initializeCard = async () => {
      if (!window.Square) {
        setError('Square.js failed to load. Please refresh the page.');
        return;
      }

      if (!appId || !locationId) {
        setError('Square credentials not configured. Please check your environment variables.');
        return;
      }

      // Clear the container before attaching
      if (cardContainerRef.current) {
        cardContainerRef.current.innerHTML = '';
      }

      try {
        const payments = window.Square.payments(appId, locationId);
        const cardInstance = await payments.card();
        await cardInstance.attach(cardContainerRef.current);

        // Store in ref immediately after attach to prevent double initialization
        cardInstanceRef.current = cardInstance;
        setCard(cardInstance);
      } catch (e) {
        console.error('Failed to initialize card payment:', e);
        setError('Failed to load payment form. Please refresh and try again.');
      }
    };

    initializeCard();

    // Cleanup function
    return () => {
      if (cardInstanceRef.current) {
        try {
          cardInstanceRef.current.destroy();
        } catch (e) {
          console.error('Error destroying card instance:', e);
        }
        cardInstanceRef.current = null;
        setCard(null);
      }
    };
  }, [appId, locationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePayment = async () => {
    if (!card) {
      setError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Tokenize the card
      const tokenResult = await card.tokenize();

      if (tokenResult.status === 'OK') {
        // Pass the token to parent component
        await onPaymentSuccess(tokenResult.token);
      } else {
        let errorMessage = `Tokenization failed: ${tokenResult.status}`;
        if (tokenResult.errors) {
          errorMessage += ` - ${JSON.stringify(tokenResult.errors)}`;
        }
        throw new Error(errorMessage);
      }
    } catch (e) {
      console.error('Payment error:', e);
      setError(e.message || 'Payment failed. Please try again.');
      if (onPaymentError) {
        onPaymentError(e);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Payment Details
      </Typography>

      <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
        <strong>Test Card:</strong> 4111 1111 1111 1111<br />
        <strong>Expiration:</strong> Any future date (e.g., 12/25)<br />
        <strong>CVV:</strong> Any 3 digits | <strong>Postal:</strong> Any 5 digits
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        ref={cardContainerRef}
        sx={{
          mb: 3,
          minHeight: '100px',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 2,
        }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handlePayment}
        disabled={isProcessing || !card}
        sx={{
          bgcolor: '#75d72c',
          color: '#fff',
          fontWeight: 'bold',
          py: 1.5,
          '&:hover': {
            bgcolor: '#5fb824',
          },
          '&.Mui-disabled': {
            bgcolor: '#ccc',
            color: '#888',
          },
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
            Processing...
          </>
        ) : (
          `Pay $${(amount / 100).toFixed(2)}`
        )}
      </Button>

      <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'center', color: '#666' }}>
        Your payment is secured by Square
      </Typography>
    </Box>
  );
};

export default PaymentForm;
