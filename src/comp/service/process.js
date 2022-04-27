import styles from './process.module.sass'
import { memo, useRef } from 'react'
import Image from 'next/image'
import FadeUp from '/src/lib/fadeup'


const loreum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const steps = [['Step Name', loreum], ['Step Name', loreum], ['Step Name', loreum]]
const step_imgs = ['/tree.png', '/tree.png', '/tree.png']

function Process({intro, steps, imgs}){
    const res = []
    {steps.forEach((step, i) => {
            res.push(<FadeUp key={-i-1}><ProcessImage img={imgs[i]}/></FadeUp>)
            res.push(<FadeUp key={i}><div className={styles.step}>
                <div className={styles['step-title']}>{`${i+1}. ${step[0]}`}</div>
                <div className={styles['step-text']}>{step[1]}</div>
            </div></FadeUp>)
    })}
    return <>
        <div className={styles.heading}>{'.Our Process.'}</div>
        <FadeUp><Desc text={intro} /></FadeUp>
        <div className={styles.process}>
            {res}
        </div>
    </>

}

Process = memo(Process)
Process.defaultProps = {
    steps: steps,
    imgs: step_imgs
}

function Desc({text}){
    return <>
        <div className={styles.desc}>
            <div className={styles["desc-text"]}>{text}</div>
        </div>
    </>
}

Desc.defaultProps = {
    text: loreum
}


function ProcessImage({img, alt}){
    return <div className={styles["process-image-cont"]}>
        <div className={styles["process-image"]}>
            <Image 
                src={img}
                alt={alt}
                layout="fill"
                objectFit="cover"
                quality={100}
            />
        </div>
    </div>
}

ProcessImage.defaultProps = {
    img: '/tree.png',
    alt: 'inai'
}

export default Process