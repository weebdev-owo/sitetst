import css from "./scrollnav.module.sass"
import { forwardRef, memo, useEffect, useRef } from 'react'
import classnames from 'classnames'
import noHash from '/src/lib/nohash'
import Link from 'next/link'
import { useRouter } from "next/router"

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
                navRef.current.style.top = "-55px"
                noHash()
            }
        }, 100)
    }


    useEffect(() =>{
        if (window){
            prev = window.pageYOffset
            navRef.current.style.top = "-55px"
            window.onscroll = () => {
                cur = window.pageYOffset
                if (prev > cur) {navRef.current.style.top = "0"} 
                else {navRef.current.style.top = "-55px";}
                prev = cur;
            }
            setReset(() => reset_tst)
        }
    })

    return <section className={css.navbar} ref={navRef}>
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

ScrollNav = memo(ScrollNav)
ScrollNav.defaultProps = {
    setReset: () => {}
}
export default ScrollNav