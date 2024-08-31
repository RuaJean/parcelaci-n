import { useEffect, useState, useRef } from 'react';
import PropertyListing from './PropertyListing';
import styles from '../styles/MobileInteractiveMap.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const MobileInteractiveMap = () => {
  const [error, setError] = useState(false);
  const [activeParcel, setActiveParcel] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(2); // Controla el nivel de zoom
  const mapContainerRef = useRef(null); // Referencia al contenedor del mapa
  const mapRef = useRef(null); // Referencia al SVG
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

      const rootSvgElement = svgDoc.documentElement;

      if (!rootSvgElement || typeof rootSvgElement.getBBox !== 'function') {
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

        // area.addEventListener('mouseover', () => {
        //   const img = svgDoc.getElementById(`popup_${parcelId}`);
        //   if (img) {
        //     img.style.display = 'block';
        //   }
        // });

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

        rootSvgElement.appendChild(img);

        area.classList.add(styles.clickable);
      });

      // Centramos el mapa después de cargarlo
      const rootBBox = rootSvgElement.getBBox();
      mapContainerRef.current.scrollTo(
        (rootBBox.width * zoomLevel - mapContainerRef.current.clientWidth) / 2,
        (rootBBox.height * zoomLevel - mapContainerRef.current.clientHeight) / 2
      );
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
      if (
        propertyListingRef.current &&
        !propertyListingRef.current.contains(event.target) &&
        !closeButtonRef.current.contains(event.target)
      ) {
        setActiveParcel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [propertyListingRef]);

  const handleCloseListing = () => {
    setActiveParcel(null);
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.5, 5)); // Límite superior de zoom
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.5, 1)); // Límite inferior de zoom
  };

  useEffect(() => {
    const svgDoc = mapRef.current?.contentDocument;
    const rootSvgElement = svgDoc?.documentElement;

    if (rootSvgElement && typeof rootSvgElement.getBBox === 'function') {
      rootSvgElement.style.transform = `scale(${zoomLevel})`;
      rootSvgElement.style.transformOrigin = 'top left'; // Escalar desde la esquina superior izquierda

      // Ajuste para mantener el mapa visible al hacer zoom
      const rootBBox = rootSvgElement.getBBox();

      mapContainerRef.current.scrollTo(
        (rootBBox.width * zoomLevel - mapContainerRef.current.clientWidth) / 3,
        (rootBBox.height * zoomLevel - mapContainerRef.current.clientHeight) / 3
      );
    }
  }, [zoomLevel]);
  const handleViewDetails = () => {
    if (activeParcel) {
      window.open(`/predios/${activeParcel}`, '_blank');
    }
  };

  return (
    <>
      {error ? (
        <p className={styles.errorMessage}>Error al cargar el mapa. Verifica la ruta del archivo SVG.</p>
      ) : (
        <div className={styles.mapWrapper}>
          <div className={styles.zoomControls}>
            <button className={styles.zoomButton} onClick={handleZoomIn}>+</button>
            <button className={styles.zoomButton} onClick={handleZoomOut}>-</button>
          </div>
          <div className={styles.mapContainer} ref={mapContainerRef}>
            <object
              id="map"
              data="/mapID.svg"
              type="image/svg+xml"
              className={styles.mapSvg}
              ref={mapRef}
            ></object>
          </div>
          {activeParcel && (
            <div
              ref={propertyListingRef}
              className={styles.propertyListingContainer}
            >
              <PropertyListing lotNumber={`LP 0${activeParcel}`} onClose={handleCloseListing} />
              <div className={styles.buttons}>
                <button 
                  ref={closeButtonRef}
                  className={styles.closeButton} 
                  onClick={handleCloseListing}
                >
                  X
                </button>
                <button 
                  className={styles.detailsButton} 
                  onClick={handleViewDetails}
                >
                  <FontAwesomeIcon icon={faInfoCircle} /> {/* Ícono de flecha */}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MobileInteractiveMap;
