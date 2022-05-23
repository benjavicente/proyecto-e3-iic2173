import styles from '../styles/Home.module.css'

const Navbar = ({ logged }) => {
  // Logged es un parámetro booleano que indica si existe un 
  // usuario loggeado, este parámetro se le envía desde la vista a la 
  // que se llama este componente
  return (
    <header>
      <div className={styles.navbarContainer}>
        <div className={styles.row}>
          <a className={styles.rowItem} href="/">Pingtoc</a>
          <a className={styles.rowItem} href="/">Mapa</a>
          <a className={styles.rowItem} href="/users">Usuarios</a>
        </div>
        <div>
          {logged ? 
            <div className={styles.row}>
              <a className={styles.rowItem} href="/users/profile">Perfil</a>
              <a className={styles.rowItem} href="/api/auth/logout">Cerrar Sesión</a>
            </div>
            :
            <div className={styles.row}>
              <a className={styles.rowItem} href="/api/auth/login">Iniciar Sesión</a>
            </div>            
          }          
        </div>
      </div>
    </header>
  )
}

export default Navbar