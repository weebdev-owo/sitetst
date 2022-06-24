//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import ServiceModel from '/src/cms/data/service/model'
//frontend
import {useRef, useEffect, useState} from 'react'
import Img from '/src/comp/image/img'
import styles from '/src/styles/home.module.sass'
import Carousel from '/src/comp/carousel/small_car'
import TabCarousel from '/src/comp/tabCarousel/small_car'
import Thirds from '/src/lib/comps/thirds'
import MainLogo from '/src/svg/mcfd_logo'
import NavBar from '/src/comp/nav/navbar'
import Link from 'next/link'
import {useParallax, Parallax, ParallaxProvider} from 'react-scroll-parallax'
import {setBgCol} from '/src/lib/utils/setbg'
import getMobile from '/src/lib/utils/useIsMobile'

let isMobile = false


export default function Home({services}){

    // const [isMobile, setIsMobile] = useState({true})
    useEffect(()=>{setBgCol(false)},[])
    useEffect(() =>{
        isMobile = getMobile(window)
        console.log(isMobile)
    })
    return <>
        {/* <Thirds /> */}
        <ParallaxProvider>
            <TopBar />
            <div className={styles['page']}>
                
                <Parallax opacity={[4,-2]}>
                    <Landing />
                </Parallax>


                {/* <Parallax speed={0}> */}

                <ReasonsFull />
                <ServicesFull />
                {/* </Parallax> */}


            </div>

            </ParallaxProvider>
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

function Landing({}){
    return <>
        <div className={styles['landing']}>


            <Carousel>
                <Slide 
                    src={'/toothv2.png'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Dolor en feit en nuim veri, Dolor en feit en nuim veri.'}
                />
                <Slide 
                    src={'/f1.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Dolor en feit en nuim veri, Dolor en feit en nuim veri.'}
                />
            </Carousel>





        </div>
    </>
}

const dwn = (dwn) => [-dwn, dwn*1.5]
const op = (op) => [op, 2-op]
function Slide({src, alt, title, desc, children}){
    // const { msgRef } = useParallax({ speed: 10 })
    return <>
        <div className={styles['slide-cont']}>
        {/* <div className={styles['slide']}> */}

            <Parallax speed={400} disabled={isMobile} className={styles['bg2']}><Img src={src} styleIn={styles['bg3']} alt={alt}/></Parallax>
            {/* <div className={styles['content-cont']} > */}
                <Parallax translateY={dwn(1000)} scale={[1,1]} disabled={isMobile} className={styles['content']}>
                    <div className={styles['intro-text']} >{title}</div>
                    <div className={styles['intro-desc']} >{desc}</div>
                </Parallax>

            {/* </div> */}
        {/* </div> */}

        </div>
    </>
}

function TopBar2({}){
    return <>
        {/* <ParallaxProvider> */}
        <Parallax translateY={[1000,0]} disabled={isMobile} className={styles['topbar-cont']}><div className={styles['topbar']}>
            <div className={styles['logo']}>
                <a><MainLogo className={styles['logo-item']} /></a>
            </div>
            <div className={styles['nav']}>
                <NavBar />
            </div>
        </div></Parallax>
        {/* </ParallaxProvider> */}
    </>
}

function TopBar({}){
    return <>
        <div className={styles['topbar-cont']}><div className={styles['topbar']}>
            <div className={styles['logo']}>
                <a><MainLogo className={styles['logo-item']} /></a>
            </div>
            <div className={styles['nav']}>
                <NavBar />
            </div>
        </div></div>
    </>
}

function ServicesFull({}){
    return <>
        <div className={styles['transition']}>
            
            <Parallax translateY={[-100,60]} disabled={isMobile} className={styles['text1']}>What we do Best</Parallax>
            <Services />
            {/* <div className={styles['text2']}>Loreum Ipsum Dolor</div>
            <div className={styles['text2']}>OMNOM</div>
            <div className={styles['text2']}>OMNOM</div> */}
        </div>
    </>
}

function Services({}){
    return <>
        <Parallax translateY={[0,0]} className={styles['services']}>
            <Service src={'/tree.png'} alt={'alt'}>{['Service 1', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/desert2.jpg'} alt={'alt'}>{['Service 2', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nani.png'} alt={'alt'}>{['Service 3', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/car1.jpg'} alt={'alt'}>{['Service 4', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/car2.jpg'} alt={'alt'}>{['Service 5', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/cave2.jpg'} alt={'alt'}>{['Service 6', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/ice2.jpg'} alt={'alt'}>{['Service 7', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/dnt1.jpg'} alt={'alt'}>{['Service 8', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/lava1.jpg'} alt={'alt'}>{['Service 9', 'Dolor en feit en nuim veri']}</Service>
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

function ReasonsFull({}){
    return <>
        <div className={styles['transition']}>
        {/* <ParallaxProvider> */}
            <Parallax translateY={[-100,100]} disabled={isMobile} opacity={op(5)} className={styles['text3']}>Why people love Us</Parallax>
            {/* <Services /> */}
            <Reasons /> 
            {/* <div className={styles['text2']}>Loreum Ipsum Dolor</div>
            <div className={styles['text2']}>OMNOM</div>
            <div className={styles['text2']}>OMNOM</div> */}
                    {/* </ParallaxProvider> */}
        </div>
        
    </>
}

function Reasons({}){
    return <>
        <div className={styles['reasons']}>


            <TabCarousel>
                <Tab 
                    src={'/toothv2.png'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Dolor en feit en nuim veri, Dolor en feit en nuim veri.'}
                    label={'omnom'}
                />
                <Tab
                    src={'/f1.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Dolor en feit en nuim veri, Dolor en feit en nuim veri.'}
                    label={'ree'}
                />
            </TabCarousel>





        </div>
    </>
}

function Tab({src, alt, title, desc, children}){
    // const { msgRef } = useParallax({ speed: 10 })
    return <>
        <div className={styles['slide-cont']}>
            <div speed={400} className={styles['bg4']}><Img src={src} styleIn={styles['bg5']} alt={alt}/></div>
            {/* <div translateY={dwn(1000)} scale={[1,1]} className={styles['content']}>
                <div className={styles['intro-text']} >{title}</div>
                <div className={styles['intro-desc']} >{desc}</div>
            </div> */}
        </div>
    </>
}