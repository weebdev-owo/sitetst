import { useSpring, useTransition, animated as a } from 'react-spring'
import { useReducer } from 'react'
import styles from './small_car.module.sass'
import { useCallback, memo, useMemo } from 'react';

const focused = ' '+styles.focused

function DotNav({active, num_dots, jump}){
  const dots = useMemo(() => new Array(num_dots), [num_dots])
  for(let i=0; i<num_dots; i++){
    let isActive = i==active ? focused:""
    dots[i] = <div className={styles.dot+isActive} onClick={() => jump(i) } key={i}>{'\u2B24'}</div>
  }
  
  return <div className={styles.dots}>
    {dots}
  </div>

}

DotNav = memo(DotNav)
export default DotNav