import React, { useState } from 'react';
import Carousel from './Carousel';

interface DiscoveryItem {
  _id: string;
  audioFileId: string;
  imageFileId: string;
  title: string;
}

interface DiscoveryQueueCardProps {
  items: DiscoveryItem[];
}

const DiscoveryQueueCard: React.FC<DiscoveryQueueCardProps> = ({ items }) => {
  return (
    <div className="discovery-queue-card">
      <h2>Discovery Queue</h2>
        <Carousel items = {items}/>
    </div>
  );
};

export default DiscoveryQueueCard;