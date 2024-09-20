
import React, { useState, useEffect } from 'react';

const images = [
  
  '/28.jpg',
  '/27.jpg',
  '/26.jpg',
  '/25.jpg',
  '/1.jpg',
  '/Airline.png',
  '/3.jpg',
  '/20.jpeg',
  '/21.jpg'

  
  // Add more image paths as needed
];

const ImageSwitcher = () => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return (
    <div 
      style={{ 
        backgroundImage: `url(${currentImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0
      }}
    >
      {/* You can add additional content or styles here */}
    </div>
  );
};

export default ImageSwitcher;
