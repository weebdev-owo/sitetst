//frontend
import {useEffect, useState, createContext, useContext, useMemo} from 'react'
import styles from '/src/styles/home.module.sass'

import Thirds from '/src/lib/comps/thirds'
import MainLogo from '/src/svg/mcfd_logo'
// import NavBar from '/src/comp/nav/navbar'
import Link from 'next/link'
import {ParallaxProvider} from 'react-scroll-parallax'
import {setBgCol} from '/src/lib/utils/setbg'
import getMobile from '/src/lib/utils/useIsMobile'
import useMobileWidth from '/src/lib/utils/useMobileWidth'
import NavBurger from '/src/svg/nav_burger'
import Modal from '/src/comp/modal/modal'
import cn from 'classnames'
// import useToggleScroll from '/src/lib/utils/toggleScrollv2'
import ToggleScrollContext from '/src/lib/utils/toggleScrollContext'



const ConfigContext = createContext(true)
const MobileWidthContext = createContext(false)
const BookContext = createContext({'setBookOpen':()=>{}, 'bookModal':<></>, 'bookOpen': false})
const MobileNavContext = createContext({})

export {ConfigContext, MobileWidthContext, BookContext, MobileNavContext}

export default function Layout1({bgCol, startOffset, thirds, children}){
    useEffect(()=>{setBgCol(bgCol || false)},[])
    const [ScrollDisableCount, setScrollDisableCount] = useState(0) //useToggleScrollv2

    //mobile queries
    const [isMobile, setIsMobile] = useState(true)
    const isMobileWidth = useMobileWidth(800)
    useEffect(() =>{setIsMobile(getMobile(window))}, [])

    //mobile Nav state
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    //booking state
    const [bookOpen, setBookOpen] = useState(false)

    const bookModal = useMemo(()=>(<Book open={bookOpen} setOpen={setBookOpen} />),[bookOpen, mobileNavOpen])


    return <>
        {/* <Thirds /> */}
        {thirds ? <Thirds />:null}
        <ToggleScrollContext.Provider value={{ScrollDisableCount, setScrollDisableCount}}> 
        <MobileNavContext.Provider value={{mobileNavOpen, setMobileNavOpen}}>
        <MobileWidthContext.Provider value={isMobileWidth} >
        <ConfigContext.Provider value={isMobile} >
        <BookContext.Provider value={{bookModal, bookOpen, setBookOpen}}>
        <ParallaxProvider>
            <TopBar />
            {startOffset ? <div className={styles['topbar-offset']} />:null}
            {bookModal}
            <div className={styles['page']}>
                {children}

                <Contact />
            </div>
        </ParallaxProvider>
        </BookContext.Provider>
        </ConfigContext.Provider>
        </MobileWidthContext.Provider>
        </MobileNavContext.Provider>
        </ToggleScrollContext.Provider> 
    </>
}

const dwn = (dwn) => [-dwn, dwn*1.5]
const op = (op) => [op, 2-op]


function Book({open, setOpen}){
    return <>
        <Modal open={open} setOpen={setOpen} z={10002}>
            <div className={styles['book-modal-cont']}>Book</div>
        </Modal>
    </>
}

function NavBar({selected, elems, links, cta}){
    return <section className={styles.navbar}>
        {elems.map((elem,i) => {
            return <Link href={links[i]} key={i}>
                    <a 
                        key={i} 
                        className={cn(styles['nav-elem'], {[styles['nav-selected']]: selected==i})}
                    >{elem}</a>
            </Link>
        })}
        <button className={styles['nav-cta']} onClick={()=>{cta[2](true)}}>{cta[0]}</button>
    </section>
}

function TopBar({}){
    const isMobileWidth = useContext(MobileWidthContext)
    // const [mobileOpen, setMobileOpen] = useState(false)
    const {mobileNavOpen, setMobileNavOpen} = useContext(MobileNavContext)
    const {bookOpen, setBookOpen, bookModal} = useContext(BookContext)
    
    useEffect(() => {setMobileNavOpen(false)}, [isMobileWidth])

    const mobileNavModal = useMemo(()=> (
        <Modal open={mobileNavOpen && isMobileWidth} setOpen={setMobileNavOpen} z={10001}>
            <div className={styles['nav-modal-cont']}>
                <NavBar elems={['Services', 'About', 'News',]} links = {['/services', '/about', '/news']} cta={['Book', '/book', setBookOpen]}/>
            </div>  
        </Modal>
    ), [mobileNavOpen, setMobileNavOpen, isMobileWidth, setBookOpen])

    if(typeof isMobileWidth === 'undefined'){return <></>}
    if (!isMobileWidth) { return <>
        <div className={styles['topbar-cont']}><div className={styles['topbar']}>
            <div className={styles['logo']}>
                <Link href={'/'}><a><MainLogo className={styles['logo-item']} /></a></Link>
            </div>
            <div className={styles['nav']}>
                <NavBar elems={['Services', 'About', 'News',]} links = {['/services', '/about', '/news']} cta={['Book', '/book', setBookOpen]}/>
            </div>
        </div></div>
        {mobileNavModal}
    </>}

    return <>
        <div className={styles['topbar-cont']} onClick={()=>{setMobileNavOpen(true)}}>
            <div className={styles['topbar']} >
                <div className={styles['logo']}><MainLogo className={styles['logo-item']} /></div>
                <div className={styles['nav-burger']}><NavBurger /></div>
            </div>
        </div>
        {mobileNavModal}
    </>

}

function Contact({}){
    const {bookOpen, setBookOpen, bookModal} = useContext(BookContext)

    
}