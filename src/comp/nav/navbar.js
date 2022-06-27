import styles from "./navbar.module.sass"
import { memo } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import noHash from '/src/lib/utils/nohash'

const elems = ['Services', 'About', 'News', 'Book']
const links = ['/services', '/about', '/news', '/book']

const reset_tst = () => {
    setTimeout(() => {noHash()}, 100)
}
function NavBar({selected, setSelected, elems, links}){

    return <section className={styles.navbar}>
        {elems.map((elem,i) => {
            return <Link href={links[i]} key={i}>
                    <a 
                        key={i} 
                        className={classnames(styles['nav-elem'], {[styles['nav-selected']]: selected==i})}
                        onClick={() => {reset_tst()}}
                    >{elem}</a>
            </Link>
        })}
    </section>
}

export default  memo(NavBar)