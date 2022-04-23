import { useSpring, useTransition, animated as a } from 'react-spring'
import { useReducer, useEffect } from 'react'
import styles from './small_car.module.sass'
import { memo } from 'react'
import { useCallback } from 'react';
import DotNav from './dotnav';
let shifter
const shift_space = 8000
function SmallCar({children}){

  const end = children.length - 1
  const num_dots = children.length

  const reducer = useCallback((active, action) => {
    clearInterval(shifter)
    shifter = setInterval(() => {setActive('next')}, shift_space)
    let newState;
    if (typeof action == 'number'){
        newState = action
    }
    else{
      switch(action){
        case 'next': newState = active==end ? 0:active+1; break;
        case 'prev': newState = active==0 ? end:active-1; break;
        default: throw new Error()
      }
    }
    return newState
  }, [])

  const [active, setActive] = useReducer(reducer, 0)

  useEffect(() => {
    shifter = setInterval(() => {setActive('next')}, shift_space)

    return () => {clearInterval(shifter)}
  }, [])

  return <div className={styles.carousel}>
    <div className={styles.slides}>
      {children.map((child, i) => {return <Slide active={active} ord={i} key={i}>{child}</Slide>})}
      <div className={styles.next} onClick={() => setActive('next')}><div>{'\u203A'}</div> </div>
      <div className={styles.prev} onClick={() => setActive('prev')}> <div>{'\u2039'}</div></div>
    </div>
    <DotNav active={active} num_dots={children.length} jump={setActive}/>
  </div>
}

function Slide({children, active, ord}){
  const anim = useSpring({
    to: {opacity: active==ord ? 1 : 0},
    from: {opacity: 0},
    config: {duration: 1000},
  });

  return <div className={styles.slide}>
    <a.div style={{...anim}}>{children}</a.div>
  </div>
}

Slide = memo(Slide)
export default memo(SmallCar)