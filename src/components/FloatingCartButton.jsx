import { Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const FloatingCartButton = () => {
  const { getTotalItems, openCart } = useCart();
  const itemCount = getTotalItems();

  return (
    <Fab
      color="primary"
      aria-label="cart"
      onClick={openCart}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        bgcolor: '#75d72c',
        color: '#fff',
        '&:hover': {
          bgcolor: '#5fb824',
        },
        zIndex: 1000,
      }}
    >
      <Badge badgeContent={itemCount} color="error">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  );
};

export default FloatingCartButton;
