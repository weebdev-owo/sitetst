import styles from './modal.module.sass'
import {createPortal} from 'react-dom'
import useToggleScroll from '/src/lib/utils/toggleScroll'
import {useState, useEffect} from 'react'

function Modal({open, setOpen, children}){
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
       setMounted(true)
       return () => setMounted(false)
    }, [])
    console.log(open)
    useToggleScroll(open)


    return mounted ? createPortal(<>
            <div className={`${styles['modal-cont']} ${open && styles['open']}`}>
                <div className={styles['topbar']}>
                    <div></div>
                    <button type="button" className={styles["modal-close"]} onClick={()=>{setOpen(false)}}>{'\u2715'}</button>
                </div>
                {children}
            </div> 
        </>, document.getElementById('modal'))
    :
        null
}

export default Modal