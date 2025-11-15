import React from 'react';
import { Grid } from '@mui/material';
import MenuItem from './MenuItem';

const MenuSection = ({ items }) => {
  return (
    <Grid container columns={12} spacing={2}>
      {items.map((dish) => {
        const itemId = dish.id || dish.name;
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={itemId}>
            <MenuItem item={dish} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MenuSection;
