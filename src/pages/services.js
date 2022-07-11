//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import getItemData from '/src/cms/lib/models/getItemData'
//frontend
import {useRef, useEffect, useState, createContext, useContext, useMemo} from 'react'
import Img from '/src/comp/image/img'
import styles from '/src/styles/services.module.sass'
import Carousel from '/src/comp/carousel/small_car'
import TabCarousel from '/src/comp/tabCarousel/small_car'
import Thirds from '/src/lib/comps/thirds'
import MainLogo from '/src/svg/mcfd_logo'
// import NavBar from '/src/comp/nav/navbar'
import Layout, {ConfigContext, MobileWidthContext, BookContext, MobileNavContext} from '/src/lib/layouts/layout1'
import Link from 'next/link'
import {useParallax, Parallax, ParallaxProvider, ParallaxBanner} from 'react-scroll-parallax'
import {setBgCol} from '/src/lib/utils/setbg'
import getMobile from '/src/lib/utils/useIsMobile'
import FadeUp from '/src/lib/animations/fadeup2'
import useMobileWidth from '/src/lib/utils/useMobileWidth'
import NavBurger from '/src/svg/nav_burger'
import Modal from '/src/comp/modal/modal'
import cn from 'classnames'
// import useToggleScroll from '/src/lib/utils/toggleScrollv2'
import ToggleScrollContext from '/src/lib/utils/toggleScrollContext'


export default function Page({services}){
    return <>
        <Layout bgCol={true} startOffset>
                <ServicesSection />
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

function ServicesSection({}){
    const isMobile = useContext(ConfigContext)

    return <>
        <div className={styles['services-section']}>
            <div className={styles['intro']}>
                <div className={styles['intro-title']}>Services</div> 
                <div className={styles['intro-desc']}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div> 
            </div>
            <Members />
            <div className={styles['intro']}>
                <div className={styles['intro-title']}>Services</div> 
                <div className={styles['intro-desc']}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</div> 
            </div>
        </div>
    </>
}
function Members({}){
    return <>
        <div className={styles['members']}>
            <Member 
                src={'/nani2.png'} alt={'ree'} order={1}
                name={'Service 1'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
            />
            <Member 
                src={'/b3.png'} alt={'ree'} order={2}
                name={'Service 2'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
            />
            <Member 
                src={'/nani5.png'} alt={'ree'} order={3}
                name={'Service 3'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'}
            />
            <Member 
                src={'/nani4.png'} alt={'ree'} order={4}
                name={'Service 4'}
                desc={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
            />
        </div>
    </>
}

function Member({src, alt, order, name, desc}){
    const img_order = order%2 ? 2*order:2*order+1
    const text_order = order%2 ? 2*order+1:2*order
    const member_text_class = order%2 ? styles['member-text-right']:styles['member-text-left']
    const isMobileWidth = useContext(MobileWidthContext)
    if(!isMobileWidth) { return <>
        {/* <Img src={src} styleIn={styles['img3']} cStyle={{order: img_order}} alt={alt}/> */}
        <ParallaxImg src={src} alt={alt} img_order={img_order} />
        <div className={member_text_class} style={{order: text_order}}>
                <Link href={`/`}><a className={styles['service-text-cont']}>
                    <div className={styles['member-name']}>{name}</div>
                    <div className={styles['member-desc']}>{desc}</div>
                    <button className={styles['service-cta']}>{`Learn More`}</button> 
                </a></Link>
        </div>
    </>}
        
    return <>
        <Img src={src} styleIn={styles['img3']} alt={alt}/>  
        <div className={styles['member-text']} >
            <div className={styles['member-name']}>{name}</div>
            <div className={styles['member-desc']}>{desc}</div>
            <Link href={`/`}><button className={styles['service-cta']}>{`learn more`}</button></Link> 
        </div>

    </>
}

const ParallaxImg = ({src,img_order, alt}) => {
    return <>
        <div style={{order: img_order}}>
            <ParallaxBanner className={styles['img3']} layers={[{
                speed: -10,
                children: (<Img src={src} styleIn={styles['img3']} alt={alt}/>),
            }]}/>
        </div>
    </>
}