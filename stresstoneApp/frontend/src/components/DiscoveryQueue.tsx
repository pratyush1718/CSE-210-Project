import React, { useState } from 'react';
import DiscoveryQueueCard from './DiscoveryQueueCard';

const App: React.FC = () => {
  // set items will set the id and imageURL and title, NOT IMPLEMENTED YET
  const [items, setItems] = useState([
    { id: '1', imageUrl: 'https://placehold.co/600x400', title: 'Item 1' },
    { id: '2', imageUrl: 'https://placehold.co/600x400', title: 'Item 2' },
    { id: '3', imageUrl: 'https://placehold.co/600x400', title: 'Item 3' },
    { id: '4', imageUrl: 'https://placehold.co/600x400', title: 'Item 4' },
    { id: '5', imageUrl: 'https://placehold.co/600x400', title: 'Item 5' },
    { id: '6', imageUrl: 'https://placehold.co/600x400', title: 'Item 6' },
    { id: '7', imageUrl: 'https://placehold.co/600x400', title: 'Item 7' },
    { id: '8', imageUrl: 'https://placehold.co/600x400', title: 'Item 8' },
    { id: '9', imageUrl: 'https://placehold.co/600x400', title: 'Item 9' },
    { id: '10', imageUrl: 'https://placehold.co/600x400', title: 'Item 10' },
  ]);

  // fill the discovery queue out later via json response from server
  // THESE ARE JUST PLACEHOLDERS FOR NOW

  return (
    <div className="App">
      <DiscoveryQueueCard items={items} />
    </div>
  );
};

export default App;