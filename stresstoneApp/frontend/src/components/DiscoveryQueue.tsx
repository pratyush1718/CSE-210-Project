import React, { useState, useEffect } from 'react';
import DiscoveryQueueCard from './DiscoveryQueueCard';
import {auth} from '../firebase'

const App: React.FC = () => {
  // set items will set the id and imageURL and title, NOT IMPLEMENTED YET

  const apiURL = "http://localhost:" + import.meta.env.VITE_BACKEND_PORT + "/api/discovery/recommendations";
  console.log(apiURL);

  const userID = auth.currentUser?.uid;

  const [items, setItems] = useState([
    { _id: '-1', audioFileId: '1', imageFileId: 'https://placehold.co/600x400', title: 'Item 1' },
    { _id: '-1', audioFileId: '2', imageFileId: 'https://placehold.co/600x400', title: 'Item 2' },
    { _id: '-1', audioFileId: '3', imageFileId: 'https://placehold.co/600x400', title: 'Item 3' },
    { _id: '-1', audioFileId: '4', imageFileId: 'https://placehold.co/600x400', title: 'Item 4' },
    { _id: '-1', audioFileId: '5', imageFileId: 'https://placehold.co/600x400', title: 'Item 5' },
    { _id: '-1', audioFileId: '6', imageFileId: 'https://placehold.co/600x400', title: 'Item 6' },
    { _id: '-1', audioFileId: '7', imageFileId: 'https://placehold.co/600x400', title: 'Item 7' },
    { _id: '-1', audioFileId: '8', imageFileId: 'https://placehold.co/600x400', title: 'Item 8' },
    { _id: '-1', audioFileId: '9', imageFileId: 'https://placehold.co/600x400', title: 'Item 9' },
    { _id: '-1', audioFileId: '10', imageFileId: 'https://placehold.co/600x400', title: 'Item 10' },
  ]);

  console.log(items);

  useEffect(() => {
    const fetchRecommendations = async (apiURL: string) => {
      //console.log('Fetching recommendations from URL:', apiURL);
      //console.log('ID is ', userID);
      try {
        
        const response = await fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firebaseId : userID }),
        });
        
  
        //const response = await fetch(apiURL);
        //console.log('Response status:', response.status);
        const responseData = await response.json();
  
        if (responseData && responseData.recommendations) {
          //console.log('recommendations: ', responseData.recommendations);
          setItems(responseData.recommendations);
        }
        else {
          console.log('no message');
        }
        // Log headers to check content type
        response.headers.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        console.log('Buffer received, size:', buffer.byteLength);
        
        if (buffer.byteLength === 0) {
          throw new Error('The fetched recommendation data is empty.');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
  
    };

    fetchRecommendations(apiURL);
  }, []);


  //console.log('recommendations: ',recommendations);
  // fill the discovery queue out later via json response from server
  // THESE ARE JUST PLACEHOLDERS FOR NOW

  return (
    <div className="App">
      <DiscoveryQueueCard items={items} />
    </div>
  );
};

export default App;