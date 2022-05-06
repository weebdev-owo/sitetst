import styles from "./scrollnav.module.sass"
import { memo, useEffect, useRef } from 'react'
import classnames from 'classnames'
import noHash from '/src/lib/utils/nohash'
import Link from 'next/link'


const elems = ['Services', 'About', 'Book']
const links = ['/#Services', '/#About', '#Book']
let cur
let prev



function ScrollNav({selected, setSelected, setReset}){
    const navRef = useRef(null)
    const reset_tst = () => {
        // router.push('')
        setTimeout(() => {
            if(navRef.current){
                navRef.current.style.top = "-65px"
                noHash()
            }
        }, 200)
    }


    useEffect(() =>{
        if (window){
            prev = window.pageYOffset
            navRef.current.style.top = "-65px"
            window.onscroll = () => {
                cur = window.pageYOffset
                if (navRef.current){
                    if (prev > cur) {navRef.current.style.top = "0"} 
                    else {navRef.current.style.top = "-65px";}
                }
                prev = cur;
            }
            setReset(() => reset_tst)
        }
    })

    return <section className={styles.navbar} ref={navRef}>
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

ScrollNav = memo(ScrollNav)
ScrollNav.defaultProps = {
    setReset: () => {}
}
export default ScrollNav