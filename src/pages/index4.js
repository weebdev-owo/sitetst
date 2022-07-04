//frontend
import {useRef, useEffect, useState, createContext, useContext, useMemo} from 'react'
import Img from '/src/comp/image/img'
import styles from '/src/styles/home.module.sass'
import Carousel from '/src/comp/carousel/small_car'
import TabCarousel from '/src/comp/tabCarousel/small_car'
import Thirds from '/src/lib/comps/thirds'
import MainLogo from '/src/svg/mcfd_logo'
// import NavBar from '/src/comp/nav/navbar'
import Link from 'next/link'
import {useParallax, Parallax, ParallaxProvider} from 'react-scroll-parallax'
import {setBgCol} from '/src/lib/utils/setbg'
import getMobile from '/src/lib/utils/useIsMobile'
import FadeUp from '/src/lib/animations/fadeup2'
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

export default function Page({services}){
    // console.log(services)
    //set body and scroll
    useEffect(()=>{setBgCol(false)},[])
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
        <ToggleScrollContext.Provider value={{ScrollDisableCount, setScrollDisableCount}}> 
        <MobileNavContext.Provider value={{mobileNavOpen, setMobileNavOpen}}>
        <MobileWidthContext.Provider value={isMobileWidth} >
        <ConfigContext.Provider value={isMobile} >
        <BookContext.Provider value={{bookModal, bookOpen, setBookOpen}}>
        <ParallaxProvider>
            <TopBar />
            {bookModal}
            <div className={styles['page']}>
                <Parallax opacity={[4,-2]}><LandingSection /></Parallax>
                <ReasonsSection />
                {/* <ReasonsSection /> */}
                <ServicesSection />
                THE MCFD DIFFRENCE (BEFORE AND AFTER)
                WHAT OUR CLIENTS SAY
                PRICING
                <TeamSection />
            </div>
        </ParallaxProvider>
        </BookContext.Provider>
        </ConfigContext.Provider>
        </MobileWidthContext.Provider>
        </MobileNavContext.Provider>
        </ToggleScrollContext.Provider> 
    </>
}


//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import getInitialData from '/src/cms/lib/models/getInitialData'
export async function getStaticProps(){
    try {
        const connection = await dbConnect()
        return {
            props: {
                services: await getInitialData('services', [['enabled', true]], ['url', 'services.tile'], ['services.tile.order'], 'remap')
            }
        }
    } 
    catch (error) {console.log('inside static props error', error); return {notFound: true}}
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
                <a><MainLogo className={styles['logo-item']} /></a>
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

function LandingSection({}){
    return <>
        <div className={styles['landing']}>
            <Carousel>
                <Slide 
                    src={'/docs2.jpg'} alt={''}
                    title={'We are Melbourne Centre For Dentistry'}
                    desc={'Inovators in quality and comfort'}
                />
                <Slide 
                    src={'/toothv2.png'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Lorem ipsum dolor sit amet, int adipiscing elit.'}
                />
                <Slide 
                    src={'/c1.png'} alt={''}
                    title={'Lorem ipsum'}
                    desc={'Lorem ipsum dolor sit amet, int adipiscing elit.'}
                />
            </Carousel>
        </div>
    </>
}

function Slide({src, alt, title, desc, children}){
    const isMobile = useContext(ConfigContext)
    const isMobileWidth = useContext(MobileWidthContext)
    if(!isMobileWidth) { return <>
        <div className={styles['slide-cont']}>
            <Parallax speed={400} disabled={isMobile} className={styles['bg2']}><Img src={src} styleIn={styles['bg3']} alt={alt}/></Parallax>
            <Parallax speed={-400} disabled={isMobile} className={styles['content-cont']} >
                <div className={styles['content']}>
                    <div className={styles['intro-text']} >{title}</div>
                    <div className={styles['intro-desc']} >{desc}</div>
                </div>
            </Parallax>
        </div>
    </>}
    return <>
        <div className={styles['slide-cont']}>
            <Parallax speed={400} disabled={isMobile} className={styles['bg2']}><Img src={src} styleIn={styles['bg3']} alt={alt}/></Parallax>
            <Parallax speed={-400} disabled={isMobile} className={styles['content-cont']} >
                <div className={styles['content']}>
                    <div className={styles['intro-text']} >{title}</div>
                    <div className={styles['intro-desc']} >{desc}</div>
                </div>
            </Parallax>         
        </div>
    </>



}

function ReasonsSection({}){
    const isMobile = useContext(ConfigContext)

    return <>
        <div className={styles['transition']}>
            <Parallax translateY={[-100,100]} disabled={isMobile} opacity={op(5)} className={styles['text3']}>Why people love Us</Parallax>
            <Reasons /> 
        </div>
        
    </>
}

function Reasons({}){
    return <>
        <Parallax opacity={[4, -2]} className={styles['reasons']}>
            <TabCarousel>
                <Tab2 
                    src={'/nani3.png'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'}
                    label={'Reason 1'}
                />
                <Tab2
                    src={'/b1.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    label={'Reason 2'}
                />
                <Tab2
                    src={'/b3.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco'}
                    label={'Reason 3'}
                />
            </TabCarousel>
        </Parallax>
    </>
}

function Tab({src, alt, title, desc, children}){

    return <>
        <div className={styles['reason-cont']}>
            <div className={styles['reason-desc-cont']}>
                <div className={styles['reason-desc']}>
                    {desc}
                </div>
            </div>
            <Img src={src} styleIn={styles['bg5']} alt={alt}/>
        </div>
    </>
}

function Tab2({src, alt, desc, children}){
    const isMobileWidth = useContext(MobileWidthContext)
    return <>
        <div className={styles['reason-cont2']}>
            {!isMobileWidth ? <Img src={src} styleIn={styles['bg52']} alt={alt}/>:null}
            <div className={styles['reason-desc-cont2']}>
                <div className={styles['reason-desc2']}>
                    {desc}
                </div>
            </div>
            {isMobileWidth ? <Img src={src} styleIn={styles['bg52']} alt={alt}/>:null}
        </div>
    </>
}

function ServicesSection({}){
    const isMobile = useContext(ConfigContext)

    return <>
        <div className={styles['transition']}>
            <Parallax translateY={[-100,60]} disabled={isMobile} className={styles['text1']}>What we do Best</Parallax>
            <Services />
        </div>
    </>
}

function Services({}){
    const isMobileWidth = useContext(MobileWidthContext)
    const isMobile = useContext(ConfigContext)

    return <>
        <Parallax opacity={[4, -1]} disabled={isMobile} className={styles['services']}>
            <FadeUp dist={10} disabled={isMobileWidth}><Service src={'/tree.png'} alt={'alt'}>{['Service 1', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={4} disabled={isMobileWidth}><Service src={'/nature/desert2.jpg'} alt={'alt'}>{['Service 2', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={6} disabled={isMobileWidth}><Service src={'/nani.png'} alt={'alt'}>{['Service 3', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={12} disabled={isMobileWidth}><Service src={'/car1.jpg'} alt={'alt'}>{['Service 4', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={8} disabled={isMobileWidth}><Service src={'/car2.jpg'} alt={'alt'}>{['Service 5', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={15} disabled={isMobileWidth}><Service src={'/nature/cave2.jpg'} alt={'alt'}>{['Service 6', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={16} disabled={isMobileWidth}><Service src={'/nature/ice2.jpg'} alt={'alt'}>{['Service 7', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={6} disabled={isMobileWidth}><Service src={'/dnt1.jpg'} alt={'alt'}>{['Service 8', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={12} disabled={isMobileWidth}><Service src={'/nature/lava1.jpg'} alt={'alt'}>{['Service 9', 'Dolor en feit en nuim veri']}</Service></FadeUp>
        </Parallax>
    </>
}

function Service({src, alt, title, desc, children}){

    return <>
        <Link href={'/index3'}>
            <div className={styles['service']}>
                <Img src={src} styleIn={styles['img2']} alt={alt}/>   
                <div className={styles['service-content']}>
                    <div className={styles['service-title']}>{children[0]}</div>
                    <div className={styles['service-desc']}>{children[1]}</div>
                </div>
            </div>
        </Link>

    </>
}

function TeamSection({}){
    const isMobile = useContext(ConfigContext)
    return <>
        <div className={styles['team']}>
            <Parallax translateY={[-100,100]} opacity={op(6)} disabled={isMobile} className={styles['text4']}>Meet your Team</Parallax>
            <Members />
        </div>
    </>
}

function Members({}){
    return <>
        <div className={styles['members']}>
            <Member 
                src={'/c1.png'} alt={'ree'} order={1}
                name={'Dr. Habib'}
                role={'Lead Technician'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
            />
            <Member 
                src={'/c2.png'} alt={'ree'} order={2}
                name={'Dr. Habib'}
                role={'Lead Technician'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
            />
            <Member 
                src={'/c6.png'} alt={'ree'} order={3}
                name={'Dr. Habib'}
                role={'Lead Technician'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
            />
            <Member 
                src={'/c4.png'} alt={'ree'} order={4}
                name={'Dr. Habib'}
                role={'Lead Technician'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
            />
        </div>
    </>
}

function Member({src, alt, order, name, role, desc}){
    const img_order = order%2 ? 2*order:2*order+1
    const text_order = order%2 ? 2*order+1:2*order
    const member_text_class = order%2 ? styles['member-text-right']:styles['member-text-left']
    const isMobileWidth = useContext(MobileWidthContext)
    if(!isMobileWidth) { return <>
        <Img src={src} styleIn={styles['img3']} cStyle={{order: img_order}} alt={alt}/>   
        <div className={member_text_class} style={{order: text_order}}>
            <div className={styles['member-name']}>{name}</div>
            <div className={styles['member-role']}>{role}</div>
            <div className={styles['member-desc']}>{desc}</div>
        </div>
    </>}
    return <>
        <Img src={src} styleIn={styles['img3']} alt={alt}/>  
        <div className={styles['member-text']} >
            <div className={styles['member-name']}>{name}</div>
            <div className={styles['member-role']}>{role}</div>
            <div className={styles['member-desc']}>{desc}</div>
        </div>

    </>
}

function Contact({}){
    const {bookOpen, setBookOpen, bookModal} = useContext(BookContext)

}