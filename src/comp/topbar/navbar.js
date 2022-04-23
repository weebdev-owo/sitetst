import css from "./navbar.module.sass"
import { forwardRef, memo } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import noHash from '/src/lib/nohash'
const elems = ['Services', 'About', 'Book']
const links = ['/#Services', '/#About', '#Book']

const reset_tst = () => {
    setTimeout(() => {noHash()}, 100)
}
function NavBar({selected, setSelected}){

    return <section className={css.navbar}>
        {elems.map((elem,i) => {
            return <Link href={links[i]} key={i} onClick={() => {reset_tst}}>
                    <a 
                        href={links[i]}
                        key={i} 
                        className={classnames(css.nav_elem, {[css.selected]: selected==i})}
                        onClick={() => {reset_tst()}}
                    >{elem}</a>
            </Link>
        })}
    </section>
}

export default  memo(NavBar)