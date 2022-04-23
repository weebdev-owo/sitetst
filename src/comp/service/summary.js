import {memo} from 'react'
import styles from './summary.module.sass'
import Image from 'next/image'
import FadeUp from '/src/lib/fadeup'

const loreum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const loreum2 = 'Lorem ipsum, dolor sit, amet consectetur, adipiscing elit.'
const statements = ['Lorem ipsum.',  'Dolor sit.', 'Amet consectetur.']
const imgs = ['/tree.png', '/tree.png', '/tree.png']
const texts = [`[what is service] ${loreum}`, `[why service] ${loreum}`]

function Summary({imgs, statements, texts}){
    return <>
        <div className={styles["main-summary"]}>
            <FadeUp><MainDesc statements={statements}/></FadeUp> 
            <FadeUp><SumImage img={imgs[0]} css={"img-1"}/></FadeUp> 
        </div>
        <div className={styles.summarys}>
            <FadeUp><SumImage img={imgs[1]} css={"img-2"}/></FadeUp> 
            <FadeUp><Desc text={texts[0]}/></FadeUp> 
            <FadeUp><SumImage img={imgs[2]} css={"img-3"}/></FadeUp> 
            <FadeUp><Desc text={texts[1]}/></FadeUp>  
        </div>
    </>
}

Summary = memo(Summary)
Summary.defaultProps = {
    imgs: imgs,
    statements: statements,
    texts: texts
}

function Space(){
    return <div className={styles.space}></div>
}
function MainDesc({statements}){
    return <div className={styles.statements}>
        {statements.map((statement, i) => {
            return <div className={styles.statement} key={i}>{statement}</div>
        })}
    </div>
}

function Desc({text}){
    return <div className={styles.desc}>
        <div className={styles.text}>{text}</div>
    </div>
}

function SumImage({img, alt, css}){
    return <div className={styles[css]}>
        <div className={styles["image"]}>
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


export default Summary