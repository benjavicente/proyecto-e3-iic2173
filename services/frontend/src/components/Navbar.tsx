import styles from '../styles/Home.module.css'
import Head from "next/head";

const Navbar = () => {
  const navigation = [
		{ name: 'Mapa', href: '/ ' },
		{ name: 'Usuarios', href: '/' }
	];

  return (
    <header >
      <div className={styles.navbarContainer}>
        <div className={styles.row}>
          <a className={styles.rowItem} href="/">Pingtoc</a>
          <a className={styles.rowItem} href="/">Mapa</a>
          <a className={styles.rowItem} href="/users">Usuarios</a>
        </div>
        <div className={styles.row}>
          <a className={styles.rowItem} href="/auth">Iniciar Sesión</a>
        </div>
      </div>
    </header>
  )
}

export default Navbar