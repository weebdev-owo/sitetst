import Create from '/src/comp/admin/services/create'
import styles from '/src/styles/home.module.sass'


export default function Home(){

  return <>
    <div className={styles.home}>
      <Create />
    </div>
  </>
}

