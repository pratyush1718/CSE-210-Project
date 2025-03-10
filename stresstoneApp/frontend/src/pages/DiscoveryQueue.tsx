import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { recommendDispatcher } from '../controller/recommendDispatcher';
import Carousel from '../components/Carousel';
import { ExtendedTrackObjSpec, TrackObjSpec } from '../types';

const App: React.FC = () => {
  // set items will set the id and imageURL and title, NOT IMPLEMENTED YET

  const userID = auth.currentUser?.uid;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (userID) {
      const recommendContent = recommendDispatcher(userID);

      // Log headers to check content type
      // response.headers.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });
      recommendContent.then((recommendContent) => {
        const updatedSpec = recommendContent.map((spec: TrackObjSpec) => ({
          ...spec,
          audioUrl: `/api/audio/stream/${spec.audioFileId}`,
        } as ExtendedTrackObjSpec));
        setItems(updatedSpec);
      })
    }
  }, [userID]);

  return (
    <Carousel items={items} />
  );
};

export default App;
