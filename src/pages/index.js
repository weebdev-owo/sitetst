//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import getItemData from '/src/cms/lib/models/getItemData'
//frontend
import {useContext} from 'react'
import Img from '/src/comp/image/img'
import styles from '/src/styles/home.module.sass'
import Carousel from '/src/comp/carousel/small_car'
import TabCarousel from '/src/comp/tabCarousel/small_car'
// import NavBar from '/src/comp/nav/navbar'
import Layout, {ConfigContext, MobileWidthContext, BookContext, MobileNavContext} from '/src/lib/layouts/layout1'
import Link from 'next/link'
import {Parallax, ParallaxBanner} from 'react-scroll-parallax'



export default function Page({services}){
   console.log(services)
    return <>
        {/* <Thirds /> */}
        <Layout>
            <Parallax opacity={[4,-2]}><LandingSection /></Parallax>
            <ReasonsSection />
            {/* <ReasonsSection /> */}
            <ServicesSection />
            THE MCFD DIFFRENCE (BEFORE AND AFTER)
            WHAT OUR CLIENTS SAY
            PRICING
            <TeamSection />
            <ResultsSection />
        </Layout>
    </>
}

export async function getStaticProps(){
    try {
        const connection = await dbConnect()
        return {
            props: {
                // services: await getItemData('service', [['enabled', true], ['home.enabled', true]], ['url', 'home.tile'], ['services.home.order'], "remap")
            }
        }
    } 
    catch (error) {console.log('inside static props error', error); return {notFound: true}}
}


const dwn = (dwn) => [-dwn, dwn*1.5]
const op = (op) => [op, 2-op]



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
    console.log(isMobile, 'RERERERERERER')
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
                <Tab
                    src={'/nani3.png'} alt={''}
                    title={'Dental Made Simple'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.'}
                    label={'Reason 1'}
                />
                <Tab
                    src={'/b1.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    label={'Reason 2'}
                />
                <Tab
                    src={'/b3.png'} alt={''}
                    title={'Dentistry Made Easy'}
                    desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco'}
                    label={'Reason 3'}
                />
            </TabCarousel>
        </Parallax>
    </>
}

function Tab({src, alt, desc, children}){
    const isMobileWidth = useContext(MobileWidthContext)
    return <>
        <div className={styles['reason-cont2']}>
            {!isMobileWidth ? <ParallaxImg src={src} styleIn={styles['bg52']} alt={alt}/>:null}
            <div className={styles['reason-desc-cont2']}>
                <div className={styles['reason-desc2']}>
                    {desc}
                </div>
            </div>
            {isMobileWidth ? <ParallaxImg src={src} styleIn={styles['bg52']} alt={alt}/>:null}
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
           <Service src={'/tree.png'} alt={'alt'}>{['Service 1', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/desert2.jpg'} alt={'alt'}>{['Service 2', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nani.png'} alt={'alt'}>{['Service 3', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/car1.jpg'} alt={'alt'}>{['Service 4', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/car2.jpg'} alt={'alt'}>{['Service 5', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/cave2.jpg'} alt={'alt'}>{['Service 6', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/ice2.jpg'} alt={'alt'}>{['Service 7', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/dnt1.jpg'} alt={'alt'}>{['Service 8', 'Dolor en feit en nuim veri']}</Service>
            <Service src={'/nature/lava1.jpg'} alt={'alt'}>{['Service 9', 'Dolor en feit en nuim veri']}</Service>
            {/* <FadeUp dist={12} disabled={isMobileWidth}><Service src={'/nature/lava1.jpg'} alt={'alt'}>{['Service 9', 'Dolor en feit en nuim veri']}</Service></FadeUp> */}
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
                src={'/c10.png'} alt={'ree'} order={2}
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
        <ParallaxImg src={src} styleIn={styles['img3']} img_order={img_order} cStyle={{order: img_order}} alt={alt}/>   
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

function ResultsSection({}){
    const isMobile = useContext(ConfigContext)
    return <>
        <div className={styles['team']}>
            <Parallax translateY={[-100,100]} opacity={op(6)} disabled={isMobile} className={styles['text4']}>The MCFD Diffrence</Parallax>
            <Members />
        </div>
    </>
}



const ParallaxImg = ({src,img_order, alt, styleIn, speed}) => {
    const ord_style = img_order ? {order: img_order}:{}
    return <>
        <ParallaxBanner className={styleIn} style={ord_style} layers={[{
            speed: speed || -20,
            children: (<Img src={src} styleIn={styles['parallax-img']} alt={alt}/>),
        }]}/>
    </>
}