import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image src="/isotipo.png" alt="Logo" width={70} height={70} />
          </Link>
        </div>
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/">Inicio</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#">Sobre Nosotros</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#">Servicios</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="#">Contacto</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div className={`${styles.bar} ${isOpen ? styles.open : ''}`}></div>
          <div className={`${styles.bar} ${isOpen ? styles.open : ''}`}></div>
          <div className={`${styles.bar} ${isOpen ? styles.open : ''}`}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
