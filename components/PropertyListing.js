// import React from 'react';
// import Image from 'next/image';
// import { Heart, ArrowLeft, Recycle } from 'lucide-react';
// import styles from '../styles/PropertyListing.module.css';

// export default function PropertyListing({ lotNumber }) {
//   // Extraer el valor de activeParcel usando una expresión regular
//   const parcelRegex = /LP 0(\d+)/;
//   const match = lotNumber.match(parcelRegex);


//   const activeParcel = match ? match[1] : null;
//   // Validar activeParcel (si es necesario)
//   if (!activeParcel) {
//     return <p>Datos inválidos para la parcela.</p>;
//   }

//   // Datos dinámicos simulados basados en el activeParcel
//   const propertyData = {
//     "1": {
//       price: "$28.400.000",
//       size: "Mide M2 5.367",
//       image: "/finca1.png",
//       details: {
//         type: "Farm Land Sale",
//         plotArea: "1 Acre",
//         listedBy: "Agent",
//         length: "208.71 Feet",
//         breadth: "208.71 Feet",
//         facing: "South",
//       },
//     },
//     "2": {
//       price: "$30.000.000",
//       size: "Mide M2 6.000",
//       image: "/finca2.png",
//       details: {
//         type: "Farm Land Sale",
//         plotArea: "1.2 Acre",
//         listedBy: "Owner",
//         length: "220.00 Feet",
//         breadth: "210.00 Feet",
//         facing: "North",
//       },
//     },
//     "3": {
//       price: "$10.000.000",
//       size: "Mide M2 1.000",
//       image: "/finca3.png",
//       details: {
//         type: "Farm Land Sale",
//         plotArea: "1.2 Acre",
//         listedBy: "Owner",
//         length: "220.00 Feet", 
//         breadth: "210.00 Feet",
//         facing: "North",
//       },
//     },
//     // Agrega más propiedades aquí...
//   };

//   // Obtener los datos de la propiedad basados en activeParcel
//   const property = propertyData[activeParcel];
//   if (!property) {
//     return <p>No se encontraron datos para esta parcela.</p>;
//   } 

//   return (
//     <div className={styles['property-listing']}>
//       <div className={styles['property-image']}>
//         <Image
//           src={property.image}
//           alt="Farm land"
//           width={1200}
//           height={450}
//           className={styles.image}
//         />
//         <div className={`${styles['icon-container']} ${styles['icon-left']}`}>
//           <Recycle className={styles.icon} />
//         </div>
//         {/* <div className={`${styles['icon-container']} ${styles['icon-right']}`}>
//           <Recycle className={styles.icon} />
//         </div> */}
//         <div className={styles['date-badge']}>
//           02/14
//         </div>
//         <div className={styles.pagination}>
//           {[...Array(7)].map((_, i) => (
//             <div
//               key={i}
//               className={`${styles['pagination-dot']} ${
//                 i === 3 ? styles['pagination-dot-active'] : styles['pagination-dot-inactive']
//               }`}
//             ></div>
//           ))}
//         </div>
//       </div>
      
//       <div className={styles['property-details']}>
//         <div className={styles['property-header']}>
//           <h2 className={styles['property-title']}>{property.price}</h2>
//           <Heart className={styles['heart-icon']} />
//         </div>
//         <p className={styles['lot-number']}>{lotNumber}</p>
//         <p className={styles['property-size']}>{property.size}</p>
        
//         <div className={styles['details-container']}>
//           <h3 className={styles['details-title']}>Property Details</h3>
//           <table className={styles['details-table']}>
//             <tbody>
//               <tr>
//                 <td className={styles['table-cell']}>Type</td>
//                 <td className={styles['table-cell']}>{property.details.type}</td>
//               </tr>
//               <tr>
//                 <td className={styles['table-cell']}>Plot Area</td>
//                 <td className={styles['table-cell']}>{property.details.plotArea}</td>
//               </tr>
//               <tr>
//                 <td className={styles['table-cell']}>Listed By</td>
//                 <td className={styles['table-cell']}>{property.details.listedBy}</td>
//               </tr>
//               <tr>
//                 <td className={styles['table-cell']}>Length</td>
//                 <td className={styles['table-cell']}>{property.details.length}</td>
//               </tr>
//               <tr>
//                 <td className={styles['table-cell']}>Breadth</td>
//                 <td className={styles['table-cell']}>{property.details.breadth}</td>
//               </tr>
//               <tr>
//                 <td className={styles['table-cell']}>Facing</td>
//                 <td className={styles['table-cell']}>{property.details.facing}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/PropertyListing.js
import React from 'react';
import Image from 'next/image';
import { Heart, Info, Home, DollarSign, MapPin } from 'lucide-react'; // Añadimos los íconos necesarios
import styles from '../styles/PropertyListing.module.css';

export default function PropertyListing({ lotNumber }) {
  // Extraer el valor de activeParcel usando una expresión regular
  const parcelRegex = /LP 0(\d+)/;
  const match = lotNumber.match(parcelRegex);
  const activeParcel = match ? match[1] : null;

  if (!activeParcel) {
    return <p>Datos inválidos para la parcela.</p>;
  }

  // Datos dinámicos simulados basados en el activeParcel
  const propertyData = {
    "1": {
      price: "$28.400.000",
      location: "Colombia",
      size: "M2 5,367",
      image: "/finca1.png",
      details: {
        type: "Farm Land Sale",
        plotArea: "1 Acre",
        listedBy: "Agent",
        length: "208.71 Feet",
        breadth: "208.71 Feet",
        facing: "South",
      },
    },
    "2": {
      price: "$30.000.000",
      location: "Colombia",
      size: "M2 6,000",
      image: "/finca2.png",
      details: {
        type: "Farm Land Sale",
        plotArea: "1.2 Acre",
        listedBy: "Owner",
        length: "220.00 Feet",
        breadth: "210.00 Feet",
        facing: "North",
      },
    },
    "3": {
      price: "$10.000.000",
      location: "Colombia",
      size: "M2 1,000",
      image: "/finca3.png",
      details: {
        type: "Farm Land Sale",
        plotArea: "1.2 Acre",
        listedBy: "Owner",
        length: "220.00 Feet", 
        breadth: "210.00 Feet",
        facing: "North",
      },
    },
  };

  const property = propertyData[activeParcel];

  if (!property) {
    return <p>No se encontraron datos para esta parcela.</p>;
  }

  return (
    <div>
      <Image
        src={property.image}
        alt={`Farm land in ${property.location}`}
        width={300}
        height={200}
        className={styles.image}
      />
      <div className={styles.info}>
        <div className={styles.priceContainer}>
          <DollarSign className={styles.icon} />
          <h2 className={styles.price}>{property.price}</h2>
        </div>
        <div className={styles.locationContainer}>
          <MapPin className={styles.icon} />
          <p className={styles.location}>{property.location}</p>
        </div>
        <div className={styles.dataDiv}>
          <p className={styles.details}>LP – 0{activeParcel}</p>
          <p className={styles.details}>{property.size}</p>
          <div className={styles.iconDetails}>
            <Home className={styles.icon} /> Farm Land
          </div>
        </div>
       
      </div>
      <div className={styles.extraInfo}>
        <p>Type: {property.details.type}</p>
        <p>Plot Area: {property.details.plotArea}</p>
        <p>Listed By: {property.details.listedBy}</p>
        <p>Length: {property.details.length}</p>
        <p>Breadth: {property.details.breadth}</p>
        <p>Facing: {property.details.facing}</p>
      </div>
      <button className={styles.reserveButton}>Reserve</button>
    </div>
  );
}




