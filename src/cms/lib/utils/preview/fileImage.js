import Image from 'next/image'
import styles from './img.module.sass'
import {memo, useRef, useState, useEffect} from 'react'

function FileImage({file, w, h, alt, styleIn}){
    const [src, setSrc] = useState(null)
    
    useEffect(() =>{
        const reader = new FileReader()
        reader.onloadend = () => {setSrc(reader.result.toString() || '')}
        reader.readAsDataURL(file)
    }, [file])

    const container = styleIn? {position: "relative", "max-width": '50vw', "max-height": "50vh"} : {position: "relative", width: `${w}`,height: `${h}`}
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

FileImage = memo(FileImage)
FileImage.defaultProps = {
    alt: "image did not load",
    w: '30vw',
    h: '30vh',
}
export default FileImage

