import MainLogo from '/src/svg/mcfd_logo'
import styles from './logobar.module.sass'

export default function LogoBar() {
    return <section className={styles.logobar}>
      <a><MainLogo className={styles.logo} /></a>
    </section>
}