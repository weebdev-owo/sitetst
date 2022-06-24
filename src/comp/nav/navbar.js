import styles from "./navbar.module.sass"
import { memo } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import noHash from '/src/lib/utils/nohash'

const elems = ['Services', 'About', 'Book']
const links = ['/services', '/about', '/book']

const reset_tst = () => {
    setTimeout(() => {noHash()}, 100)
}
function NavBar({selected, setSelected}){

    return <section className={styles.navbar}>
        {elems.map((elem,i) => {
            return <Link href={links[i]} key={i}>
                    <a 
                        key={i} 
                        className={classnames(styles.nav_elem, {[styles.selected]: selected==i})}
                        onClick={() => {reset_tst()}}
                    >{elem}</a>
            </Link>
        })}
    </section>
}

export default  memo(NavBar)