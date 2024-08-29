// components/PopupContainer.js

import React from 'react';
import styles from '../styles/PopupContainer.module.css';

const PopupContainer = ({ lotNumber }) => {
  return (
    <div className={styles.popupContainer}>
      <img src="/popup.png" alt={`Popup for ${lotNumber}`} className={styles.image} />
      <div className={styles.text}>{lotNumber}</div>
    </div>
  );
};

export default PopupContainer;
