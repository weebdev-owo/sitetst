import { useReducer, useEffect, useCallback, memo, useState, useMemo } from 'react'
import styles from './tabnav.module.sass'


function TabNav({children}){

    const end = children.length - 1
    const num_dots = children.length
    const [active, setActive] = useState(0)
    const labels = children.map(elem => elem?.props?.label)

    return <>
        <DotNav active={active} num_dots={children.length} jump={setActive} labels={labels}/>
        {children[active]}
    </>

}


function DotNav({active, num_dots, jump, labels}){
    const dots = useMemo(() => new Array(num_dots), [num_dots])
    for(let i=0; i<num_dots; i++){
        dots[i] = <div className={`${styles.dot} ${i==active && styles.focused}`} onClick={() => jump(i)} key={i}>{labels[i]}</div>
    }
    
    return <>
        <div className={styles.dots}>{dots}</div>
    </>

}

export default TabNav