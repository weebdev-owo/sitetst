//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import ServiceModel from '/src/cms/data/service/model'
//frontend
import {useRef, useEffect} from 'react'
import Img from '/src/comp/image/img'
import styles from '/src/styles/home.module.sass'
import Carousel from '/src/comp/carousel/small_car'
import Thirds from '/src/lib/comps/thirds'
import MainLogo from '/src/svg/mcfd_logo'
import NavBar from '/src/comp/nav/navbar'
import Link from 'next/link'
import {useParallax, Parallax, ParallaxProvider} from 'react-scroll-parallax'
import {setBgCol} from '/src/lib/utils/setbg'




export default function Home({services}){


    useEffect(()=>{setBgCol(false)},[])
    return <>
        {/* <Thirds /> */}
        <ParallaxProvider>
            <TopBar />
            <div className={styles['page']}>
                <Parallax speed={-1000}>
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
                    src={'/black.jpg'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Dolor en feit en nuim veri, Dolor en feit en nuim veri Dolor en feit en nuim veri'}
                />
                <Slide 
                    src={'/f1.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Dolor en feit en nuim veri, Dolor en feit en nuim veri Dolor en feit en nuim veri'}
                />
            </Carousel>


        </div>
    </>
}

function Slide({src, alt, title, desc, children}){
    // const { msgRef } = useParallax({ speed: 10 })
    return <>
        <div className={styles['slide-cont']}>
        {/* <div className={styles['slide']}> */}
            <Parallax translateY={[300,-300]} className={styles['bg2']}><Img src={src} styleIn={styles['bg3']} alt={alt}/></Parallax>
            {/* <div className={styles['content-cont']} > */}
                <Parallax translateY={[-90,90]} className={styles['content']}>
                    <div className={styles['intro-text']} translateY={[-90,90]}>{title}</div>
                    <div className={styles['intro-desc']} translateY={[-90,90]}>{desc}</div>
                </Parallax>

            {/* </div> */}
        {/* </div> */}
        </div>
    </>
}

function TopBar2({}){
    return <>
        <Parallax translateY={[-2700,300]} className={styles['topbar-cont']}><div className={styles['topbar']}>
            <div className={styles['logo']}>
                <a><MainLogo className={styles['logo-item']} /></a>
            </div>
            <div className={styles['nav']}>
                <NavBar />
            </div>
        </div></Parallax>
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
            
            <Parallax translateY={[-100,60]} className={styles['text1']}>What we do Best</Parallax>
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
            <Service src={'/tree.png'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/nature/desert2.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/nani.png'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/car1.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/car2.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/nature/cave2.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/nature/ice2.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/dnt1.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
            <Service src={'/nature/lava1.jpg'} alt={'alt'}>{['omnom', 'ree']}</Service>
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
            
            <Parallax translateY={[-60,60]} className={styles['text1']}>Why people love Us</Parallax>
            <Services />
            {/* <div className={styles['text2']}>Loreum Ipsum Dolor</div>
            <div className={styles['text2']}>OMNOM</div>
            <div className={styles['text2']}>OMNOM</div> */}
        </div>
    </>
}
