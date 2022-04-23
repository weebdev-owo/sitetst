import {memo, useRef, useEffect, useState} from 'react'
import styles from './counters.module.sass'
import FadeUp from '/src/lib/fadeup'




function Counters(){
    return <div className={styles.counters}>
        <Counter title={"Implants"} target={1000} />
        <Counter title={"All-on-4"} target={100} />
        <Counter title={`Smile \n Transformations`} target={200} />
    </div>
}

const speed = 50
const updateCount = (num, tar, func1, interval) => {
    console.log('exec',)
    const inc = Math.trunc(tar/speed)
    if(num < tar){const newnum = num+inc; func1(newnum)}
    else (clearInterval(interval), func1(`+${tar}`))
}

function Counter({title, target}){
    const [cnum, setCnum] = useState(0)
    useEffect(() => {
        const incr = setInterval(() => {updateCount(cnum, target, setCnum, incr)}, 40)
        return () => {if(incr){clearInterval(incr)}}
    }, [cnum])

    return <FadeUp><div className={styles.counter}>
        <a className={styles.title}>{title}</a>
        <span className={styles.separator}></span>
        <div className={styles.num} >{cnum}</div>
    </div></FadeUp>
}

export default memo(Counters)