import React, { useState } from 'react';
import './Carousel.css'; // Import styles

interface CarouselProps {
  items: { id: string; imageUrl: string; title: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Go to the next item in the carousel
  const nextItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  // Go to the previous item in the carousel
  const prevItem = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const playSong = () => {
    // TO IMPLEMENT
  };

  return (
    <div className="carousel-container">
      <button className="carousel-button prev" onClick={prevItem}>
        &#8592;
      </button>
      <div className="carousel-items">
        <div className="carousel-item">
          <img src={items[currentIndex].imageUrl} alt={items[currentIndex].title} />
          <button className="carousel-button play-button" onClick={playSong} />
          <h3>{items[currentIndex].title}</h3>
        </div>
      </div>
      <button className="carousel-button next" onClick={nextItem}>
        &#8594;
      </button>
    </div>
  );
};

export default Carousel;
