import { useAuth0 } from '@auth0/auth0-react';

import styles from '~/styles/Home.module.css'
import useLocalStorage from '~/hooks/useLocalStorage';
import useLocalStorageEmail from '~/hooks/useLocalStorageEmail';

const Navbar = () => {
  const [token, setToken] = useLocalStorage<string | null>("token")
  const setEmail = useLocalStorageEmail<string | null>("token")[1]
  const { loginWithRedirect, logout } = useAuth0();

  function handleLogout() {
    setToken(null)
    setEmail(null)
    logout({ returnTo: window.location.origin })
  }

  return (
    <header>
      <div className="flex items-center justify-between bg-slate-800 text-slate-100 px-5 py-2">
        <div className="flex items-center gap-x-10 justify-between">
          <a href="/">Pingtoc</a>
          <a href="/">Mapa</a>
          <a href="/users">Usuarios</a>
          <a href="/chat">Chat General</a>
        </div>
        <div>
          {token ?
            <div className="flex gap-x-10 items-center justify-between">
              <a href="/users/pings">Pings</a>
              <a href="/users/profile?id=me">Perfil</a>
              <button className="" onClick={() => handleLogout()}>Cerrar Sesión</button>
            </div>
            :
            <div className={styles.row}>
              <button onClick={() => loginWithRedirect()}>Iniciar Sesión</button>
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Navbar
