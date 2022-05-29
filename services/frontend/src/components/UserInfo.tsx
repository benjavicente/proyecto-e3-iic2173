import { useRouter } from 'next/router'

import styles from '../styles/Home.module.css'

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
      <img src={ user.images.length != 0 ? user.images[0].imageUrl
      : 'https://pbs.twimg.com/profile_images/1117986986508394496/bq8RcTlm_400x400.png' } className={styles.imgUser} alt="UserPhoto" /> 
      <p className={styles.rowItem}>{user.email}</p>
      { user.phone ? <p className={styles.rowItem}>+56{user.phone}</p> : null}      
    </div>
  )
}

export default UserInfo