import { useAuth0 } from '@auth0/auth0-react';

import styles from '~/styles/Home.module.css'
import useLocalStorage from '~/hooks/useLocalStorage';

const Navbar = () => {
  const [token, setToken] = useLocalStorage<string | null>("token")
  const { loginWithRedirect, logout } = useAuth0();

  function handleLogout() {
    setToken(null)
    logout({ returnTo: window.location.origin })
  }

  return (
    <header>
      <div className={styles.navbarContainer}>
        <div className={styles.row}>
          <a className={styles.rowItem} href="/">Pingtoc</a>
          <a className={styles.rowItem} href="/">Mapa</a>
          <a className={styles.rowItem} href="/users">Usuarios</a>
        </div>
        <div>
          {token ?
            <div className={styles.row}>
              <a className={styles.rowItemPress} href="/users/pings">Pings</a>
              <a className={styles.rowItemPress} href="/users/profile?id=me">Perfil</a>
              <button className={styles.rowItemPress} onClick={() => handleLogout()}>Cerrar Sesión</button>
            </div>
            :
            <div className={styles.row}>
              <button className={styles.rowItemPress} onClick={() => loginWithRedirect()}>Iniciar Sesión</button>
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Navbar
