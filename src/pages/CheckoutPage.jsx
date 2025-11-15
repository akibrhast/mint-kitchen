import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCart } from '../context/CartContext';
import { createOrder, createPayment } from '../services/api';
import PaymentForm from '../components/PaymentForm';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'success', 'error'
  const [error, setError] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0); // Store the amount paid

  const totalAmount = getTotalPrice();
  const totalAmountCents = Math.round(totalAmount * 100);

  const handlePaymentSuccess = async (paymentToken) => {
    setPaymentStatus('processing');
    setError(null);

    try {
      // Step 1: Create Square order
      const lineItems = cartItems.map(item => ({
        item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { data: orderData, error: orderError } = await createOrder(lineItems);

      if (orderError || !orderData) {
        throw new Error(orderError || 'Failed to create order');
      }

      // Step 2: Create payment with the token
      const { data: paymentData, error: paymentError } = await createPayment(
        paymentToken,
        orderData.order_id,
        totalAmountCents
      );

      if (paymentError || !paymentData) {
        throw new Error(paymentError || 'Payment failed');
      }

      // Success! Use the actual amount from the order response
      const actualAmountPaid = orderData.total_money.amount / 100; // Convert cents to dollars
      setPaidAmount(actualAmountPaid);
      setPaymentStatus('success');
      setReceiptUrl(paymentData.receipt_url);
      clearCart();
    } catch (e) {
      console.error('Checkout error:', e);
      setError(e.message || 'Payment failed. Please try again.');
      setPaymentStatus('error');
    }
  };

  const handlePaymentError = (err) => {
    setError(err.message || 'Payment failed. Please try again.');
    setPaymentStatus('error');
  };

  if (cartItems.length === 0 && paymentStatus !== 'success') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your cart is empty
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ color: '#75d72c' }}
        >
          Back to Menu
        </Button>
      </Container>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: '#75d72c', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Thank you for your order. We'll start preparing your delicious South Indian food!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Total Paid: ${paidAmount.toFixed(2)}
          </Typography>
          {receiptUrl && (
            <Button
              variant="outlined"
              href={receiptUrl}
              target="_blank"
              sx={{
                mb: 2,
                borderColor: '#75d72c',
                color: '#75d72c',
                '&:hover': {
                  borderColor: '#5fb824',
                  bgcolor: '#f0f8e8',
                },
              }}
            >
              View Receipt
            </Button>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#75d72c',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#5fb824',
                },
              }}
            >
              Return to Menu
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: '#75d72c' }}
      >
        Back to Menu
      </Button>

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Order Summary */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Order Summary
          </Typography>
          <List>
            {cartItems.map((item) => (
              <Box key={item.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.image}
                      alt={item.name}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textSecondary">
                          {item.price} × {item.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#75d72c">
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* Payment Form */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          {paymentStatus === 'processing' ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#75d72c', mb: 2 }} />
              <Typography variant="h6">Processing Payment...</Typography>
              <Typography variant="body2" color="textSecondary">
                Please wait, do not refresh the page
              </Typography>
            </Box>
          ) : (
            <PaymentForm
              amount={totalAmountCents}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
