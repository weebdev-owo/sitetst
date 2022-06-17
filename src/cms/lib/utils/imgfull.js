import Image from 'next/image'
import styles from './img.module.sass'
import {memo, useRef} from 'react'

function Img({src, alt}){

    return <div className={styles['bg-image-cont']}>
        <div className={styles['bg-image']}>
            <Image 
                src={src}
                alt={alt}
                layout={"fill"}
                objectFit={"contain"}
                onLoadingComplete={(e)=>{
                    console.log('IMAGE LOADED',e)
                }}
            />
        </div>
    </div>
}

Img = memo(Img)
Img.defaultProps = {
    src: "",
    alt: "image did not load"
}
export default Img

