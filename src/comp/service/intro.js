import styles from './intro.module.sass'
import Image from 'next/image'
import {memo} from 'react'
import  TopBar  from '/src/comp/topbar/topbar_overlay'

const loreum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

function Bg({img, alt, children}){
    return <div className={styles['bg-image']}>
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

function Text({title, desc}){
    return <div className={styles.text}>
        <div className={styles.title}>{title}</div>
        <div className={styles.sep}></div>
        <div className={styles.desc}>{desc}</div>
    </div>
}

function Intro({title, desc, img}){
  return <div className={styles.intro}>
      <TopBar />
      <Bg img={img}/>
      <Text title={title} desc={desc}/>
  </div>
}

Intro = memo(Intro)

Intro.defaultProps = {
    title: "Service",
    desc: loreum,
    img: "/nani.png"
}

export default Intro