//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import ServiceModel from '/src/cms/data/service/model'
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



const ConfigContext = createContext(true)
const MobileWidthContext = createContext(false)

export default function Page({services}){
    const [isMobile, setIsMobile] = useState(true)
    const isMobileWidth = useMobileWidth(800)
    useEffect(()=>{setBgCol(false)},[])
    useEffect(() =>{setIsMobile(getMobile(window))}, [])


    return <>
        {/* <Thirds /> */}
        <MobileWidthContext.Provider value={isMobileWidth} >
        <ConfigContext.Provider value={isMobile} >
        <ParallaxProvider>
            <TopBar />
            <div className={styles['page']}>
                <Parallax disabled={isMobile} opacity={[4,-2]}><Landing /></Parallax>
                <ReasonsFull />
                <ServicesFull />
                <TeamFull />
            </div>
        </ParallaxProvider>
        </ConfigContext.Provider>
        </MobileWidthContext.Provider>
    </>
}

export async function getStaticProps(){
  let services = []
  let data = false
  try {
      const connection = await dbConnect()
      data = await ServiceModel.find()
          .select(['data.url', 'data.enabled', 'data.services.tile'])
          .where('data.enabled').eq(true)
          .sort({'data.services.tile.order':1})
      services = data.map((service, i) => {
          return {...service.data.services.tile, url: service.data.url}
      })
      // console.log('inside static props', services, JSON.parse(JSON.stringify(services)))
      return {
          props: {
              services: JSON.parse(JSON.stringify(services))
          }
      }
  } 
  catch (error) {
      console.log('inside static props error', error)
      return {notFound: true}
  }
}
const dwn = (dwn) => [-dwn, dwn*1.5]
const op = (op) => [op, 2-op]


function Book({open, setOpen}){
    return <>
        <Modal open={open} setOpen={setOpen}>
            <div className={styles['text1']}>REEEE</div>
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
    const toggleNav = () => {}
    const [mobileOpen, setMobileOpen] = useState(false)
    const [bookOpen, setBookOpen] = useState(false)
    useEffect(() => {setMobileOpen(false)}, [isMobileWidth])
    const book_modal = useMemo(()=>(<Book open={bookOpen} setOpen={setBookOpen}/>),[bookOpen])
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
        {book_modal}
    </>}

    return <>
        <div className={styles['topbar-cont']} onClick={()=>{setMobileOpen(true)}}>
            <div className={styles['topbar']} >
            <div className={styles['logo']}>
                <MainLogo className={styles['logo-item']} />
            </div>
            <div className={styles['nav-burger']}>
                <NavBurger />
            </div>
        </div>
        </div>
        <Modal open={mobileOpen && isMobileWidth} setOpen={setMobileOpen}>
            <div className={styles['nav-modal-cont']}>
                <NavBar elems={['Services', 'About', 'News',]} links = {['/services', '/about', '/news']} cta={['Book', '/book', setBookOpen]}/>
            </div>  
        </Modal>
        {book_modal}
    </>

}

function Landing({}){
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

function ReasonsFull({}){
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
        <div className={styles['reasons']}>
            <TabCarousel>
                <Tab 
                    src={'/nani3.png'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'}
                    label={'Reason 1'}
                />
                <Tab
                    src={'/f1.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    label={'Reason 2'}
                />
                <Tab
                    src={'/nani4.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco'}
                    label={'Reason 3'}
                />
            </TabCarousel>
        </div>
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

function ServicesFull({}){
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

    return <>
        <div className={styles['services']}>
            <FadeUp dist={10} disabled={isMobileWidth}><Service src={'/tree.png'} alt={'alt'}>{['Service 1', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={4} disabled={isMobileWidth}><Service src={'/nature/desert2.jpg'} alt={'alt'}>{['Service 2', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={6} disabled={isMobileWidth}><Service src={'/nani.png'} alt={'alt'}>{['Service 3', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={12} disabled={isMobileWidth}><Service src={'/car1.jpg'} alt={'alt'}>{['Service 4', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={8} disabled={isMobileWidth}><Service src={'/car2.jpg'} alt={'alt'}>{['Service 5', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={15} disabled={isMobileWidth}><Service src={'/nature/cave2.jpg'} alt={'alt'}>{['Service 6', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={16} disabled={isMobileWidth}><Service src={'/nature/ice2.jpg'} alt={'alt'}>{['Service 7', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={6} disabled={isMobileWidth}><Service src={'/dnt1.jpg'} alt={'alt'}>{['Service 8', 'Dolor en feit en nuim veri']}</Service></FadeUp>
            <FadeUp dist={12} disabled={isMobileWidth}><Service src={'/nature/lava1.jpg'} alt={'alt'}>{['Service 9', 'Dolor en feit en nuim veri']}</Service></FadeUp>
        </div>
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

function TeamFull({}){
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