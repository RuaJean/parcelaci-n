import { useEffect, useState } from 'react';
import DesktopInteractiveMap from '../components/DesktopInteractiveMap';
import MobileInteractiveMap from '../components/MobileInteractiveMap';

const InteractiveMapPage = ({ initialIsMobile }) => {
  const [isMobile, setIsMobile] = useState(initialIsMobile);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return isMobile ? <MobileInteractiveMap /> : <DesktopInteractiveMap />;
};

export const getServerSideProps = async ({ req }) => {
  const userAgent = req.headers['user-agent'];
  const initialIsMobile = /Mobi|Android/i.test(userAgent);

  return {
    props: { initialIsMobile },
  };
};

export default InteractiveMapPage;
