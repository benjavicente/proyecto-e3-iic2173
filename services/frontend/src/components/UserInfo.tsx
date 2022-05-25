import styles from '../styles/Home.module.css'

import { useRouter } from 'next/router'

const UserInfo = ({ user }) => {
  const router = useRouter()

  const press = (id) => {
    router.push({
      pathname: 'users/profile',
      query: { id: id },
  })
  }
  
  return (
    <div className={styles.fWElement} onClick={() => press(user.id)}>
      <p className={styles.rowItem}>{user.firstname} {user.lastname}</p>
      <img src='https://pbs.twimg.com/profile_images/1117986986508394496/bq8RcTlm_400x400.png' className={styles.imgUser} /> 
      <p className={styles.rowItem}>{user.email}</p>
      { user.phone ? <p className={styles.rowItem}>+56{user.phone}</p> : null}      
    </div>
  )
}

export default UserInfo