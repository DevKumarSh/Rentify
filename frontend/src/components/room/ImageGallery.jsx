import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import './ImageGallery.css';

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';
  const displayImages = images && images.length > 0 ? images : [defaultImage];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="image-gallery-container">
      {/* Featured Big Image */}
      <div className="gallery-main-image-wrap">
        <img
          src={displayImages[currentIndex]}
          alt={`Room photo ${currentIndex + 1}`}
          className="gallery-main-image"
        />

        {displayImages.length > 1 && (
          <>
            <button className="gallery-nav-btn prev" onClick={handlePrev} aria-label="Previous image">
              <ChevronLeft size={22} />
            </button>
            <button className="gallery-nav-btn next" onClick={handleNext} aria-label="Next image">
              <ChevronRight size={22} />
            </button>
            <div className="gallery-counter">
              {currentIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="gallery-thumbnails-row">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`gallery-thumb-btn ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="gallery-thumb-img" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
