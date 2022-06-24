import { useAuth0 } from '@auth0/auth0-react';

import useLocalStorage from '~/hooks/useLocalStorage';

const Navbar = () => {
  const [user, setUser] = useLocalStorage<User>('user');
  const { loginWithRedirect, logout } = useAuth0();

  if (user === undefined) {
    return (
      <div/>
    )
  }


  function handleLogout() {
    setUser({token: null, email: null})
    // setToken(null)
    // setEmail(null)
    logout({ returnTo: window.location.origin })
  }

  return (
    <header>
      <div className="shadow-lg flex items-center justify-between bg-slate-800 text-slate-100 px-5 py-2">
        <div className="flex items-center gap-x-10 justify-between">
          <a href="/">Mapa</a>
          <a href="/users">Usuarios</a>
          <a href="/chat">Chat General</a>
        </div>

        <div>
          {user.token ?
            <div className="flex gap-x-10 items-center justify-between">
              <a href="/users/pings">Pings</a>
              <a href="/users/profile?id=me">Perfil</a>
              <button className="my-2" onClick={() => handleLogout()}>Cerrar Sesión</button>
            </div>
            :
            <div className="my-2">
              <button onClick={() => loginWithRedirect()}>Iniciar Sesión</button>
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Navbar
