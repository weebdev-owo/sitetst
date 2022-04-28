import Create from '/src/admincomp/services/create'
import styles from '/src/css/home.module.sass'


export default function Home(){

  return <>
    <div className={styles.home}>
      <Create />
    </div>
  </>
}

