/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect, memo } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { imagePreview } from '/src/lib/image/crop/imagePreview'
import { useDebounce } from '/src/lib/image/crop/useDebounce'
import styles from './cropImageForm.module.sass'
import FileImage from '/src/lib/image/preview/fileImage'
import PreviewImage from '/src/lib/image/preview/previewImage'





function CropImage({file, styleIn, saveCroppedFile, save}) {

    useEffect(() => {if (croppedFile){saveCroppedFile(croppedFile)}}, [save])

    const [originalSrc, setOriginalSrc] = useState('')
    const originalRef = useRef(null)
    const [crop, setCrop] = useState(null)
    const [completedCrop, setCompletedCrop] = useState(null)
    const [croppedSrc, setCroppedSrc] = useState('')
    const [croppedFile, setCroppedFile] = useState(null)

    useEffect(() =>{
        setCrop(undefined)
        setCroppedFile(null)
        const reader = new FileReader()
        reader.onloadend = () => {setOriginalSrc(reader.result.toString() || '')}
        reader.readAsDataURL(file)
    }, [file])

    const throttle_interval = 100
    const renderPreview = async () =>{
        if (completedCrop?.width && completedCrop?.height && originalRef.current) {
            const data = await imagePreview(originalRef.current, completedCrop)
            const [imgURL, file] = data
            console.log(file)
            setCroppedSrc(imgURL)
            setCroppedFile(file)
        }
    }
    useDebounce(renderPreview, throttle_interval, [completedCrop, file])


  return <> 
        <div className={styles['crop-cont']}>
            <div className={styles['title']}>Original Image</div> 
            {originalSrc && 
                <ReactCrop 
                    crop={crop} 
                    onChange={(_, percentCrop) => setCrop(percentCrop)} 
                    onComplete={(c) => setCompletedCrop(c)} 
                >
                    <img ref={originalRef} alt="Crop me" src={originalSrc} />
                </ReactCrop>
            }
            <div className={styles['title']}>Website Preview</div> 
        </div>
        <div className={styles['result-cont']}>
            <div className={styles['result']}>
                {croppedSrc && <PreviewImage src={croppedSrc} alt={'Crop result'} styleIn={styleIn}/>}
            </div>
            
        </div>


    </>
  
}

CropImage = memo(CropImage)
export default CropImage