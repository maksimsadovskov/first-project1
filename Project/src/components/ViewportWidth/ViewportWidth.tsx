import React, { useState, useEffect } from 'react';
import './ViewportWidth.css';

const ViewportWidth: React.FC = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="viewport-width-indicator">
      Viewport: {width}px
    </div>
  );
};

export default ViewportWidth;

