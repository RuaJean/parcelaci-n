import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import PropertyListing from '../components/PropertyListing';
import styles from '../styles/DesktopInteractiveMap.module.css';

let activeParcelMouseOut = null;

const DesktopInteractiveMap = () => {
  const [error, setError] = useState(false);
  const [activeParcel, setActiveParcel] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const propertyListingRef = useRef(null);
  const closeButtonRef = useRef(null);
  const router = useRouter();
  const originalColor = '#ff4f4f';
  const hoverAndClickColor = '#8B0000';

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
        changeParcelColor(svgDoc, parcelId, originalColor);
      });

      parcels.forEach((area) => {
        const parcelId = area.getAttribute('id').replace('parcela_roja_', '');

        const handleClick = () => {
          resetAllParcelColors(svgDoc, parcels);
          setActiveParcel(parcelId);
          activeParcelMouseOut = parcelId;
          closeAllPopups(svgDoc);

          const tempPopup = svgDoc.getElementById(`popup_${parcelId}`);
          if (tempPopup) {
            const bbox = tempPopup.getBoundingClientRect();
            const svgRect = mapElement.getBoundingClientRect();
            const top = svgRect.top + window.scrollY + bbox.top - svgRect.top;
            const left = svgRect.left + window.scrollX + bbox.left - svgRect.left + bbox.width + 10;
            setPopupPosition({ top, left });
          }

          changeParcelColor(svgDoc, parcelId, hoverAndClickColor);
          createPersistentPopup(svgDoc, parcelId);
        };

        const handleMouseOver = () => {
          if (parcelId !== activeParcel) {
            changeParcelColor(svgDoc, parcelId, hoverAndClickColor);
          }
          const tempPopup = svgDoc.getElementById(`popup_${parcelId}`);
          if (tempPopup) {
            tempPopup.style.display = 'block'; // Mostrar el popup temporal
          }
        };

        const handleMouseOut = () => {
          if (parcelId !== activeParcelMouseOut) {
            changeParcelColor(svgDoc, parcelId, originalColor);
          }
          const tempPopup = svgDoc.getElementById(`popup_${parcelId}`);
          if (tempPopup) {
            tempPopup.style.display = 'none'; // Ocultar el popup temporal
          }
        };

        area.addEventListener('click', handleClick);
        area.addEventListener('mouseover', handleMouseOver);
        area.addEventListener('mouseout', handleMouseOut);

        createTemporaryPopup(svgDoc, parcelId, area);
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
  }, [activeParcel]);

  const createTemporaryPopup = (svgDoc, parcelId, area) => {
    const bbox = area.getBBox();
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/popup.png');
    img.setAttribute('width', '200px');
    img.setAttribute('height', '200px');
    img.setAttribute('id', `popup_${parcelId}`);

    img.style.display = 'none';

    img.setAttribute('x', bbox.x + bbox.width / 2 - 100);
    img.setAttribute('y', bbox.y - 210);

    svgDoc.documentElement.appendChild(img);

    area.classList.add(styles.clickable);
  };

  const createPersistentPopup = (svgDoc, parcelId) => {
    const bbox = svgDoc.getElementById(`parcela_roja_${parcelId}`).getBBox();
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '/popup.png');
    img.setAttribute('width', '200px');
    img.setAttribute('height', '200px');
    img.setAttribute('id', `popup_persistent_${parcelId}`);

    img.style.display = 'block';

    img.setAttribute('x', bbox.x + bbox.width / 2 - 100);
    img.setAttribute('y', bbox.y - 210);

    svgDoc.documentElement.appendChild(img);
  };

  const closeAllPopups = (svgDoc) => {
    const popups = svgDoc.querySelectorAll('[id^="popup_persistent_"], [id^="popup_"]');
    popups.forEach((popup) => popup.style.display = 'none');
  };

  const changeParcelColor = (svgDoc, parcelId, color) => {
    const area = svgDoc.getElementById(`parcela_roja_${parcelId}`);
    if (area) {
      area.style.fill = color;
    }
  };

  const resetAllParcelColors = (svgDoc, parcels) => {
    parcels.forEach((area) => {
      const parcelId = area.getAttribute('id').replace('parcela_roja_', '');
      if (parcelId !== activeParcel) {
        changeParcelColor(svgDoc, parcelId, originalColor);
      }
    });
  };

  const handleCloseListing = () => {
    const svgDoc = document.getElementById('map').contentDocument;
    if (svgDoc && activeParcel) {
      changeParcelColor(svgDoc, activeParcel, originalColor);
      const parcels = Array.from(svgDoc.querySelectorAll('[id^="parcela_roja_"]'));
      resetAllParcelColors(svgDoc, parcels);
      closeAllPopups(svgDoc);
    }

    setActiveParcel(null);
    activeParcelMouseOut = null;
  };

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
              style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
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
        </>
      )}
    </>
  );
};

export default DesktopInteractiveMap;
