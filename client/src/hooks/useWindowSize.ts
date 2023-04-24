import { useEffect, useState } from 'react';

// Hook to keep track of window size changes
const useWindowSize = () => {
  const [currentSize, setCurrentSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const resizeHandle = () => {
      setCurrentSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', resizeHandle);

    return () => {
      window.removeEventListener('resize', resizeHandle);
    };
  });

  return currentSize;
};

export default useWindowSize;
