import styles from './modal.module.sass'
import {createPortal} from 'react-dom'
import useToggleScroll from '/src/lib/utils/toggleScroll'

function Modal({open, setOpen, children}){
    console.log(open)
    useToggleScroll(open)
    return createPortal(<>
        <div className={`${styles['modal-cont']} ${open && styles['open']}`}>
            <button type="button" className={styles["modal-close"]} onClick={()=>{setOpen(false)}}>{'\u2715'}</button>
            {children}
        </div> 
    </>, document.getElementById('modal'))
}

export default Modal