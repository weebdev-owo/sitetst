import Image from 'next/image'
import styles from './img.module.sass'
import {memo, useRef, useState, useEffect} from 'react'

function PreviewImage({src, w, h, alt, styleIn}){

    const container = styleIn? {position: "relative"} : {position: "relative", width: `${w}`,height: `${h}`}
    return <> {src &&
        <div className={styleIn} style={container}>
            <div className={styles['bg-image']}>
                <Image 
                    src={src}
                    alt={alt}
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>
        </div>
    }</>
}

PreviewImage = memo(PreviewImage)
PreviewImage.defaultProps = {
    alt: "image did not load",
    w: '30vw',
    h: '30vh',
}
export default PreviewImage

