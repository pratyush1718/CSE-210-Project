import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { ExtendedTrackObjSpec, TrackObjSpec } from '../types';
import Playlist from '../components/Playlist';
import { playlistDispatcher } from '../controller/playlistDispatcher';

const PlaylistPage: React.FC = () => {
  // set items will set the id and imageURL and title, NOT IMPLEMENTED YET

  const userID = auth.currentUser?.uid;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (userID) {
      const playlistContent = playlistDispatcher(userID);

      // Log headers to check content type
      // response.headers.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);
      // });
      playlistContent.then((playlistContent) => {
        const updatedSpec = playlistContent.map((spec: TrackObjSpec) => ({
          ...spec,
          audioUrl: `/api/audio/stream/${spec.audioFileId}`,
        } as ExtendedTrackObjSpec));
        setItems(updatedSpec);
      })
    }
  }, [userID]);

  return (
    <Playlist items={items} />
  );
};

export default PlaylistPage;
