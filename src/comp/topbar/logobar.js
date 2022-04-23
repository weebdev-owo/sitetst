import MainLogo from '/src/comp/svg/mcfd_logo'
import css from './logobar.module.sass'

export default function LogoBar() {
    return <section className={css.logobar}>
      <a><MainLogo className={css.logo} /></a>
    </section>
}