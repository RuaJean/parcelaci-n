import { useEffect, useState, useRef } from 'react';
import PropertyListing from '../components/PropertyListing';
import styles from '../styles/DesktopInteractiveMap.module.css';

const DesktopInteractiveMap = () => {
  const [error, setError] = useState(false);
  const [activeParcel, setActiveParcel] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
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
          // Cerrar todos los popups existentes
          closeAllPopups(svgDoc);

          // Actualizar la parcela activa
          setActiveParcel(parcelId);

          // Obtener la posición del popup temporal asociado al área
          const tempPopup = svgDoc.getElementById(`popup_${parcelId}`);
          if (tempPopup) {
            const bbox = tempPopup.getBoundingClientRect();
            const svgRect = mapElement.getBoundingClientRect();

            // Calcular la posición para PropertyListing justo a la derecha del popup
            const top = svgRect.top + window.scrollY + bbox.top - svgRect.top;
            const left = svgRect.left + window.scrollX + bbox.left - svgRect.left + bbox.width + 10; // 10px a la derecha del popup

            setPopupPosition({ top, left });
          }

          // Crear un nuevo popup persistente para el área clicada
          createPersistentPopup(svgDoc, parcelId);
        };

        area.addEventListener('click', handleClick);

        area.addEventListener('mouseover', () => {
          const img = svgDoc.getElementById(`popup_${parcelId}`);
          if (img && parcelId !== activeParcel) {
            img.style.display = 'block';
          }
        });

        area.addEventListener('mouseout', () => {
          const img = svgDoc.getElementById(`popup_${parcelId}`);
          if (img && parcelId !== activeParcel) {
            img.style.display = 'none';
          }
        });

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
    // Ocultar y eliminar todos los popups persistentes
    const popups = svgDoc.querySelectorAll('[id^="popup_persistent_"], [id^="popup_"]');
    popups.forEach((popup) => popup.style.display = 'none');
  };

  const handleCloseListing = () => {
    const svgDoc = document.getElementById('map').contentDocument;
    if (svgDoc) {
      closeAllPopups(svgDoc);
    }
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
              style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
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
};

export default DesktopInteractiveMap;