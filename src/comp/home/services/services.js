import {memo} from 'react'
import styles from './services.module.sass'
import Image from 'next/image'
import FadeUp from '/src/lib/animations/fadeup'
import Link from 'next/link'

const services = [
    ['Service-1', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-2', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-3', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-4', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-5', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-6', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-7', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-8', 'Description', "/dnt1.jpg", 'inai', '/services'],
    ['Service-9', 'Description', "/dnt1.jpg", 'inai', '/services'],
]

function Services({services}){
    return <>
        <div id={"Services"} className={styles.heading}>.Services.</div>
        <div className={styles.services}>
            {services.map((e, i) => {
                return <FadeUp key={i}><Service title={e[0]} desc={e[1]} img={e[2]} alt={e[3]} link={e[4]} key={i}/></FadeUp>
            })}
        </div>
    </>
}

Services = memo(Services)
Services.defaultProps = {
    services: services
}

function Service({title, desc, link, img, alt}){
    return <Link href={link}>
        <a className={styles.service} >
            <div className={styles.title}>{title}</div>
            <div className={styles.desc}>{desc}</div>
            <ServiceImage img={img} alt={alt} />
        </a>
    </Link>
}

Service.defaultProps = {
    title: "Service",
    desc: "description",
    img: "/dnt1.jpg",
    link: "/"
}

function ServiceImage({img, alt, children}){
    return <div className={styles["service-image"]}>
        <Image 
            src={img}
            alt={alt}
            layout="fill"
            objectFit="cover"
            quality={100}
        />
        {children}
    </div>
}

ServiceImage.defaultProps = {
    img: '/dnt1.png',
    alt: 'inai'
}


export default Services