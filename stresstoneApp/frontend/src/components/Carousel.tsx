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


// <div className="carousel-container">
//       <button className="carousel-button prev" onClick={prevItem}>
//         &#8592;
//       </button>
//       <div className="carousel-items">
//         <div className="carousel-item">
//           <ListItem
//             sx={{
//               display: 'flex',
//               justifyContent: 'center', // Center horizontally
//               alignItems: 'center', // Center vertically
//               width: '100%', // Ensure the ListItem takes full width if needed
//             }}
//           >
//             <ListItemAvatar>
//               {items[currentIndex].imageFileId ? (
//                 <Avatar
//                   alt={items[currentIndex].title}
//                   src={`http://localhost:${port}/api/audio/image/${items[currentIndex].imageFileId}`}
//                   variant="rounded"
//                   sx={{ width: 320, height: 320 }}
//                 />
//               ) : (
//                 <Avatar alt="Music Icon" variant="rounded" sx={{ width: 320, height: 320, bgcolor: 'primary.light' }}>
//                   <MusicNoteIcon sx={{ fontSize: 320 }} />
//                 </Avatar>
//               )}
//             </ListItemAvatar>
//           </ListItem>
//           <button className="carousel-button play-button" onClick={playSong} />
//           <h3>{items[currentIndex].title}</h3>
//         </div>
//       </div>
//       <button className="carousel-button next" onClick={nextItem}>
//         &#8594;
//       </button>
//     </div>