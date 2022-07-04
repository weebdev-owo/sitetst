import { useState, memo, useRef, useEffect } from "react";
import styles from './spinner.module.sass'

function Spinner({loading, h}){
    let style = {}
    if (h){
        const bar_width = Math.min(h/7, 6)
        style = {
            height: h,
            border: `${bar_width}px solid #f3f3f3 `,
            "borderTop": `${bar_width}px solid #383636`,
        }
        // if(spinnerRef.current){spinnerRef.current.style.transform = `translateY(${100}px)`}
    }

    return <>
        <div className={styles['spinner-loading']} style={style}></div>
    </>
}

Spinner = memo(Spinner)
Spinner.defaultProps = {
    loading: true
}
export default Spinner