import {useRef, useState, useEffect, memo} from 'react'
import styles from './fadeup.module.sass'



function FadeUp({children, idd, dist}) {
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

    return (
      <div id={idd}
        className={`${styles['fade-up-section2']} ${isVisible ? styles['is-visible2'] : ''}`}
        ref={domRef}
        style={isVisible ? {transform: `none`}:{transform: `translateY(${-dist*4}vh)`} }
      >
        {children}
      </div>
    );
  }

FadeUp = memo(FadeUp)
FadeUp.defaultProps = {
  idd: null,
  dist: 20
}
export default FadeUp