import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../context/CartContext';

const MenuItem = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 99) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardMedia
        component="img"
        image={item.image}
        alt={item.name}
        sx={{ height: 220, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{item.name}</Typography>
        <Box
          sx={{
            maxHeight: '80px',
            overflowY: 'auto',
            mb: 1,
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '2px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#75d72c',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#5fb824',
              }
            }
          }}
        >
          <Typography variant="body2" color="textSecondary">
            {item.description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {item.price}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            inputProps={{
              min: 1,
              max: 99,
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
          <Tooltip title="Add to cart" arrow>
            <IconButton
              onClick={handleAddToCart}
              sx={{
                bgcolor: '#75d72c',
                color: '#fff',
                '&:hover': {
                  bgcolor: '#5fb824',
                },
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default MenuItem;
