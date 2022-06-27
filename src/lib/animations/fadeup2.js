import {useRef, useState, useEffect, memo} from 'react'
import styles from './fadeup.module.sass'



function FadeUp({children, id, dist, disabled}) {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef();
    const monitor = (setVis, vis, observer) => {
      if (vis){
        observer.unobserve(domRef.current)
        setVis(true)
      }
    }
    useEffect(() => {
      let obsElemRef = null
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => monitor(setVisible, entry.isIntersecting, observer))
      });
      if (domRef.current){
        obsElemRef = domRef.current
        observer.observe(domRef.current);
      }

      return () => {
        if(!isVisible && obsElemRef){observer.unobserve(obsElemRef)}
      }
    }, []);
    // console.log(disabled)
    let style = isVisible ? {transform: `none`}:{transform: `translateY(${-dist*2}vh)`}
    style = disabled ? {}:style
    let cls = `${styles['fade-up-section2']} ${isVisible ? styles['is-visible2'] : ''}`
    cls = disabled ? '':cls

    return (
      <div id={id}
        className={cls}
        ref={domRef}
        style={style}
      >
        {children}
      </div>
    );
  }

FadeUp = memo(FadeUp)
FadeUp.defaultProps = {
  id: null,
  dist: 20,
  disabled: false
}
export default FadeUp