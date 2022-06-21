import Image from 'next/image'
import styles from './img.module.sass'

function Img({src, alt, h, w, styleIn}){
    const style = h && w ? {height:h, width:w}:{}
    const cls = styleIn ? styleIn:''
    return <>
        <div className={cls} style={style}>
            <div className={styles.in1}>
                <div className={styles.in2}>
                    <Image 
                        src={src}
                        alt={alt}
                        layout={'fill'}
                        objectFit={'cover'}
                    />
                </div>
            </div>
        </div>
    </>
}

Img.defaultProps ={
    StyleIn: false,
    h: false,
    w: false
}

export default Img