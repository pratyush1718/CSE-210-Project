import React from 'react';
import { Skeleton, Typography } from '@mui/material';
import RecCard from './RecCard';
import { auth } from '../firebase';
import { ExtendedTrackObjSpec } from '../types';

interface CarouselProps {
  items: ExtendedTrackObjSpec[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const user = auth.currentUser;
  console.log("ITEMS" + items);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  };

  const fullWidthStyle = {
    gridColumn: '1 / span 2'
  };
  
  return (
    <>
      <Typography variant="subtitle1" component="div">
        Recommended for you
      </Typography>
      <div style={gridStyle}>
        {items.length > 0 ? (
          items.map((musicInfo) => <RecCard key={musicInfo._id} musicInfo={musicInfo} uid={user?.uid || ''} />)
        ) : (
          <div style={fullWidthStyle}>
            <Skeleton variant="rectangular" width="100%" height={118} />
          </div>
        )}
      </div>
    </>
  );
  
};

export default Carousel;