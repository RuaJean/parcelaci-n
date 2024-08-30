import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/predios.module.css';

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      const response = await fetch('/ProductDetails.json');
      const data = await response.json();
      setProperty(data[id]);
    };

    if (id) {
      fetchPropertyData();
    }
  }, [id]);

  if (!property) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles['image-container']}>
          <img
            src={property.image}
            alt={property.propertyDetails.title}
            width={800}
            height={600}
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <div>
            <h1 className={styles.title}>{property.propertyDetails.title} </h1>
            <p className={styles.subtitle}>{property.propertyDetails.address}</p>
          </div>
          <div className={styles['info-grid']}>
            <div className={styles['info-item']}>
              <h3>Tamaño</h3>
              <p>{property.details.plotArea}</p>
            </div>
            <div className={styles['info-item']}>
              <h3>Tipo</h3>
              <p>{property.details.type}</p>
            </div>
            <div className={styles['info-item']}>
              <h3>Publicado por</h3>
              <p>{property.details.listedBy}</p>
            </div>
            <div className={styles['info-item']}>
              <h3>Precio</h3>
              <p>{property.price}</p>
            </div>
          </div>
          <div className="prose max-w-none">
            <h2>Detalles del predio</h2>
            <p>{property.propertyDetails.description}</p>
            <ul>
              {property.propertyDetails.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className={styles.buttons}>
            <button className={styles.button}>
              Programar una visita
            </button>
            <button className={`${styles.button} ${styles['button-outline']}`}>
              Contactar un agente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
