import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartModal = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    // Allow empty string while user is typing
    if (newQuantity === '') {
      return;
    }

    const quantity = parseInt(newQuantity);
    if (isNaN(quantity)) {
      return;
    }

    if (quantity > 0 && quantity <= 99) {
      updateQuantity(itemId, quantity);
    } else if (quantity <= 0) {
      removeFromCart(itemId);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Dialog
      open={isCartOpen}
      onClose={closeCart}
      maxWidth="sm"
      fullWidth
      keepMounted={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#1b5e20', color: '#fff', fontWeight: 'bold' }}>
        Your Cart
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          <>
            <List>
              {cartItems.map((item, index) => (
                <Box key={item.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      gap: 2,
                      px: 0,
                    }}
                  >
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
                        <Typography variant="body2" color="textSecondary">
                          {item.price} each
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onContextMenu={(e) => e.preventDefault()}
                        onBlur={(e) => {
                          // Reset to 1 if field is empty on blur
                          if (e.target.value === '') {
                            updateQuantity(item.id, 1);
                          }
                        }}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          style: { textAlign: 'center' }
                        }}
                        sx={{
                          width: '60px',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: '#75d72c',
                            },
                            '&:hover fieldset': {
                              borderColor: '#5fb824',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#5fb824',
                            },
                          },
                        }}
                        size="small"
                      />
                      <IconButton
                        onClick={() => removeFromCart(item.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Total:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="#75d72c">
                ${getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={closeCart} sx={{ color: '#666' }}>
          Continue Shopping
        </Button>
        <Button
          onClick={handleCheckout}
          variant="contained"
          disabled={cartItems.length === 0}
          sx={{
            bgcolor: '#75d72c',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#5fb824',
            },
            '&.Mui-disabled': {
              bgcolor: '#ccc',
              color: '#888',
            }
          }}
        >
          Continue to Checkout
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;
