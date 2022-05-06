/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect, memo } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { imagePreview } from '/src/lib/image/crop/imagePreview'
import { useDebounce } from '/src/lib/image/crop/useDebounce'




function CropImage({file}) {
    const [originalSrc, setOriginalSrc] = useState('')
    const originalRef = useRef(null)
    const [crop, setCrop] = useState(null)
    const [completedCrop, setCompletedCrop] = useState(null)
    const [croppedSrc, setCroppedSrc] = useState('')
    const [croppedFile, setCroppedFile] = useState(null)


    useEffect(() =>{
        setCrop(undefined)
        const reader = new FileReader()
        reader.onloadend = () => {setOriginalSrc(reader.result.toString() || '')}
        reader.readAsDataURL(file)
    }, [file])

    const throttle_interval = 100
    const renderPreview = async () =>{
        if (completedCrop?.width && completedCrop?.height && originalRef.current) {
            const data = await imagePreview(originalRef.current, completedCrop)
            const [imgURL, file] = data
            setCroppedSrc(imgURL)
            setCroppedFile(file)
        }
    }
    useDebounce(renderPreview, throttle_interval, [completedCrop, file])


  return <> 
        {originalSrc && 
            <ReactCrop 
                crop={crop} 
                onChange={(_, percentCrop) => setCrop(percentCrop)} 
                onComplete={(c) => setCompletedCrop(c)} 
            >
                <img ref={originalRef} alt="Crop me" src={originalSrc} />
            </ReactCrop>
        }
        {croppedSrc ? <img src={croppedSrc} alt={'Crop result'} />: null}
    </>
  
}

CropImage = memo(CropImage)
export default CropImage