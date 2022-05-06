import css from './small_car.module.sass'
import Image from 'next/image'

export default function CarImage({img, alt, children}){
    return <div className={css.slide_image}>
        <Image 
            src={img}
            alt={"samurai de gozaru"}
            layout="fill"
            objectFit="cover"
            quality={100}
        />
        {children}
    </div>
}