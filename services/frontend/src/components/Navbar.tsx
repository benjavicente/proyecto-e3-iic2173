import { useAuth0 } from '@auth0/auth0-react';

import styles from '~/styles/Home.module.css'
import useLocalStorage from '~/hooks/useLocalStorage';
import useLocalStorageEmail from '~/hooks/useLocalStorageEmail';

const Navbar = () => {
  const [token, setToken] = useLocalStorage<string | null>("token")
  const [setEmail] = useLocalStorageEmail<string | null>("token")[1]
  const { loginWithRedirect, logout } = useAuth0();

  function handleLogout() {
    setToken(null)
    setEmail(null)
    logout({ returnTo: window.location.origin })
  }

  return (
    <header>
      <div className={styles.navbarContainer}>
        <div className={styles.row}>
          <a className={styles.rowItem} href="/">Pingtoc</a>
          <a className={styles.rowItem} href="/">Mapa</a>
          <a className={styles.rowItem} href="/users">Usuarios</a>
          <a className={styles.rowItem} href="/chat">Chat</a>
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
