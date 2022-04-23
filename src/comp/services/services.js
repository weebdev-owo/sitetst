import {memo} from 'react'
import styles from './services.module.sass'
import Image from 'next/image'
import FadeUp from '/src/lib/fadeup'
const services = [
    ['Service-1', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-2', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-3', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-4', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-5', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-6', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-7', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-8', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
    ['Service-9', 'Description', "/dnt1.jpg", 'http://localhost:3000/services'],
]
function Services({services}){
    return <>
        <div id={"Services"} className={styles.heading}>.Services.</div>
        <div className={styles.services}>
            {services.map((e, i) => {
                return <FadeUp key={i}><Service title={e[0]} desc={e[1]} vis={e[2]} slink={e[3]} key={i}/></FadeUp>
            })}
        </div>
    </>
}

Services = memo(Services)
Services.defaultProps = {
    services: services
}

function Service({title, desc, vis, slink}){
    return <a className={styles.service} href={slink}>
        <div className={styles.title}>{title}</div>
        <div className={styles.desc}>{desc}</div>
        <ServiceImage img={vis} alt="" />
    </a>
}

function ServiceImage({img, alt, children}){
    return <div className={styles["service-image"]}>
        <Image 
            src={img}
            alt={"samurai de gozaru"}
            layout="fill"
            objectFit="cover"
            quality={100}
        />
        {children}
    </div>
}

Service.defaultProps = {
    title: "Service",
    desc: "description",
    vis: "/dnt1.jpg"
}

export default Services