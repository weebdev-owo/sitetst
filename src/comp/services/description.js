import styles from './description.module.sass'
import { memo, useRef } from 'react'
import Image from 'next/image'
import FadeUp from '/src/lib/animations/fadeup'


const loreum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const details = [['What is Service ?', loreum], ['Why Service ?', loreum]]
const steps = [['Step Name', loreum], ['Step Name', loreum], ['Step Name', loreum]]
const step_imgs = ['/tree.png', '/tree.png', '/tree.png']

function Description({steps, step_imgs}){
    return <>
        <div className={styles.description}>
            {/* <Details /> */}
            <Process steps={steps} imgs={step_imgs}/>
            {/* <Results />
            <Requirements />
            <Questions /> */}
        </div>
    </>
}

Description = memo(Description)
Description.defaultProps = {
    steps: steps,
    step_imgs: step_imgs
}

function Details({details}){
    return <>
        <div className={styles.heading}>{'.Details.'}</div>
        <div className={styles.details}>
            {details.map((detail, i) => {
                return <div className={styles.detail} key={i}>
                    <div className={styles['detail-title']}>{detail[0]}</div>
                    <div className={styles['detail-text']}>{detail[1]}</div>
                </div>
            })}
        </div>
    </>

}

function Process({steps, imgs}){
    const res = []
    {steps.forEach((step, i) => {
            res.push(<FadeUp key={-i-1}><ProcessImage img={imgs[i]} key={-i-1}/></FadeUp>)
            res.push(<FadeUp key={i}><div className={styles.step} key={i}>
                <div className={styles['step-title']}>{`${i+1}. ${step[0]}`}</div>
                <div className={styles['step-text']}>{step[1]}</div>
            </div></FadeUp>)
    })}
    return <>
        <div className={styles.heading}>{'.Our Process.'}</div>
        <FadeUp><Desc /></FadeUp>
        <div className={styles.process}>
            {res}
        </div>
    </>

}

function Desc(){
    return <>
        {/* <div className={styles["sub-heading"]}>.Why Us.</div> */}
        <div className={styles.desc}>
            <div className={styles["desc-text"]}>{loreum}</div>
        </div>
    </>

}
Process.defaultProps = {
    steps: steps
}

function ProcessImage({img, alt, keyp}){
    return <div className={styles["process-image-cont"]} key={keyp}>
        <div className={styles["process-image"]}>
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



export default Description