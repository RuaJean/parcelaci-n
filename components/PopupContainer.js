// components/PropertyCard.js
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function PropertyCard({ imageSrc, price, location, details }) {
    return (
        <div className={styles.card}>
            <Image src={imageSrc} alt={location} className={styles.image} />
            <div className={styles.info}>
                <h2 className={styles.price}>{price}</h2>
                <p className={styles.location}>{location}</p>
                <p className={styles.details}>{details.type}</p>
                <p className={styles.details}>LP – {details.lp}</p>
                <p className={styles.details}>M2 {details.size}</p>
            </div>
            <div className={styles.extraInfo}>
                <p>Type: {details.type}</p>
                <p>Plot Area: {details.plotArea}</p>
                <p>Listed By: {details.listedBy}</p>
                <p>Length: {details.length}</p>
                <p>Breadth: {details.breadth}</p>
                <p>Facing: {details.facing}</p>
            </div>
            <button className={styles.reserveButton}>Reserve</button>
        </div>
    );
}
