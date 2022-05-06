import {memo} from 'react'
import styles from './about.module.sass'
import Image from 'next/image'
import FadeUp from '/src/lib/animations/fadeup'
const loreum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
function About(){
    return <div id="About" className={styles.about}>
        <div className={styles.heading}>.About.</div>
        <FadeUp><Desc /></FadeUp>
        <FadeUp><Dentists /></FadeUp>
    </div>
}

function Desc(){
    return <>
        <div className={styles.desc}>
            <div className={styles["desc-text"]}>{loreum}</div>
        </div>
    </>

}

function Dentists(){
    return <>
    <div className={styles["sub-heading"]}>Meet Our Team</div>
    <div className={styles.dentists}>
        <FadeUp><DentistL /></FadeUp> <FadeUp><DentistImageR img={"/doc.png"} alt="" /></FadeUp>
        <FadeUp><DentistImageL img={"/doc.png"} alt="" /></FadeUp> <FadeUp><DentistR /></FadeUp>
        <FadeUp><DentistL /></FadeUp> <FadeUp><DentistImageR img={"/doc.png"} alt="" /></FadeUp>
    </div>
    </>
}

function DentistL({name, role, desc, vis}){
    return <div className={styles.dentistL}>
        <div className={styles.title}>
            <div className={styles.name}>{name}</div>
            <div className={styles['title-separator']}>|</div>
            <div className={styles.role}> {role}</div>
        </div>
        <div className={styles['dentist-desc']}>{desc}</div>
    </div>
}

function DentistR({name, role, desc, vis}){
    return <div className={styles.dentistR}>
        <div className={styles.title}>
            <div className={styles.name}>{name}</div>
            <div className={styles['title-separator']}>|</div>
            <div className={styles.role}> {role}</div>
        </div>
        <div className={styles['dentist-desc']}>{desc}</div>
    </div>
}

DentistL.defaultProps = {
    name: "Name", 
    role: "role", 
    desc: `${loreum}`, 
    vis: "/doc1.jpg"
}

DentistR.defaultProps = {
    name: "Name", 
    role: "role", 
    desc: `${loreum}`, 
    vis: "/doc1.jpg"
}

function DentistImageL({img, alt}){
    return <div className={styles["dentist-image-contL"]}>
        <div className={styles["dentist-image"]}>
            <Image 
                src={img}
                alt={"samurai de gozaru"}
                layout="fill"
                objectFit="cover"
                quality={100}
            />
        </div>
    </div>
}

function DentistImageR({img, alt}){
    return <div className={styles["dentist-image-contR"]}>
        <div className={styles["dentist-image"]}>
            <Image 
                src={img}
                alt={"samurai de gozaru"}
                layout="fill"
                objectFit="cover"
                quality={100}
            />
        </div>
    </div>
}



export default memo(About)