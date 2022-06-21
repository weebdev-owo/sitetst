//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Service from '/src/cms/data/service/model'
//frontend
import Img from '/src/comp/image/img'
import styles from '/src/styles/home.module.sass'
import Carousel from '/src/comp/carousel/small_car'
import Thirds from '/src/lib/comps/thirds'
import MainLogo from '/src/svg/mcfd_logo'
import NavBar from '/src/comp/nav/navbar'

export default function Home({services}){
 
    return <>
        {/* <Thirds /> */}
        <div className={styles['page']}>
            <Landing />
            {/* <Transition /> */}

        </div>
    </>
}



export async function getStaticProps(){
  let services = []
  let data = false
  try {
      const connection = await dbConnect()
      data = await Service.find()
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
            <TopBar />
            {/* <div className={styles['carousel-cont']}> */}
                <Carousel>
                    <Slide src={'/black.jpg'} alt={''}>
                        <h1 className={styles['intro-text']}>Dentistry Made Easy</h1>
                        <p className={styles['intro-desc']}>Dolor en feit en nuim veri, Dolor en feit en nuim veri Dolor en feit en nuim veri</p>
                    </Slide>
                    <Slide src={'/f1.png'} alt={''}>
                        <h1 className={styles['intro-text']}>Dentistry Made Easy</h1>
                        <p className={styles['intro-desc']}>Dolor en feit en nuim veri, Dolor en feit en nuim veri Dolor en feit en nuim veri</p>
                    </Slide>
                    <Slide src={'/nani.png'} alt={''}>
                        <h1 className={styles['intro-text']}>Dentistry Made Easy</h1>
                        <p className={styles['intro-desc']}>Dolor en feit en nuim veri, Dolor en feit en nuim veri Dolor en feit en nuim veri</p>
                    </Slide>
                </Carousel>
            {/* </div> */}
            {/* <Slide src={'/nani.png'} alt={''}>
                <h1 className={styles['intro-text']}>Dentistry Made Easy</h1>
                <p className={styles['intro-desc']}>Dolor en feit en nuim veri, Dolor en feit en nuim veri Dolor en feit en nuim veri</p>
            </Slide> */}

        </div>
    </>
}

function Slide({src, alt, children}){
    return <>
        <div className={styles['slide']}>
            <Img src={src} styleIn={styles['bg']} alt={alt}/>
            <div className={styles['content']}>
                {children}
            </div>
        </div>
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

function Transition({}){
    return <>
    </>
}