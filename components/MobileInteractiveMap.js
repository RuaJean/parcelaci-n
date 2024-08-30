import { useEffect, useState, useRef } from 'react';
import PropertyListing from './PropertyListing';
import styles from '../styles/MobileInteractiveMap.module.css';

const MobileInteractiveMap = () => {
  const [error, setError] = useState(false);
  const [activeParcel, setActiveParcel] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const propertyListingRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const mapElement = document.getElementById('map');

    const handleLoad = () => {
      const svgDoc = mapElement.contentDocument;

      if (!svgDoc) {
        setError(true);
        return;
      }

      const parcels = Array.from(svgDoc.querySelectorAll('[id^="parcela_roja_"]'));

      parcels.forEach((area) => {
        const parcelId = area.getAttribute('id').replace('parcela_roja_', '');

        const handleClick = () => {
          setActiveParcel(parcelId);

          if (selectedArea) {
            const prevImg = svgDoc.getElementById(`popup_${selectedArea}`);
            if (prevImg) {
              prevImg.classList.remove(styles.selectedImage);
            }
          }

          const img = svgDoc.getElementById(`popup_${parcelId}`);
          if (img) {
            img.classList.add(styles.selectedImage);
          }

          setSelectedArea(parcelId);
        };

        area.addEventListener('click', handleClick);

        area.addEventListener('mouseover', () => {
          const img = svgDoc.getElementById(`popup_${parcelId}`);
          if (img) {
            img.style.display = 'block';
          }
        });

        area.addEventListener('mouseout', () => {
          const img = svgDoc.getElementById(`popup_${parcelId}`);
          if (img) {
            img.style.display = 'none';
          }
        });

        const bbox = area.getBBox();
        const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/popup.png');
        img.setAttribute('width', '200px');
        img.setAttribute('height', '200px');
        img.setAttribute('id', `popup_${parcelId}`);

        img.style.display = 'none';

        img.setAttribute('x', bbox.x + bbox.width / 2 - 100);
        img.setAttribute('y', bbox.y - 210);

        img.addEventListener('click', handleClick);

        svgDoc.documentElement.appendChild(img);

        area.classList.add(styles.clickable);
      });
    };

    const handleError = () => {
      setError(true);
    };

    if (mapElement) {
      mapElement.addEventListener('load', handleLoad);
      mapElement.addEventListener('error', handleError);
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('load', handleLoad);
        mapElement.removeEventListener('error', handleError);
      }
    };
  }, [selectedArea]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el clic no fue dentro de PropertyListing
      if (
        propertyListingRef.current &&
        !propertyListingRef.current.contains(event.target) &&
        !closeButtonRef.current.contains(event.target)
      ) {
        setActiveParcel(null); // Cierra el componente PropertyListing
      }
    };

    // Se añade el listener al documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el listener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [propertyListingRef]);

  const handleCloseListing = () => {
    setActiveParcel(null);
  };

  return (
    <>
      {error ? (
        <p className={styles.errorMessage}>Error al cargar el mapa. Verifica la ruta del archivo SVG.</p>
      ) : (
        <>
          <object
            id="map"
            data="/mapID.svg"
            type="image/svg+xml"
            className={styles.mapSvg}
          ></object>
          {activeParcel && (
            <div
              ref={propertyListingRef}
              className={styles.propertyListingContainer}
            >
              <PropertyListing lotNumber={`LP 0${activeParcel}`} onClose={handleCloseListing} />
              <button 
                ref={closeButtonRef}
                className={styles.closeButton} 
                onClick={handleCloseListing}
              >
                X
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};export default MobileInteractiveMap;
