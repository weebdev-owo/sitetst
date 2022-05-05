import { useDropzone } from "react-dropzone"
import {memo, useCallback, useState, useEffect} from 'react'
import { Field, Formik } from 'formik';
// import styles from '/src/css/UploadImages.module.sass'
import Img from '/src/lib/img'


function UploadImages({}){


    return <>
    <Formik initaialValues={{}} onSubmit={() => {}} >
        {({values, errors}) => (
            <DropZone />
        )}

    </Formik>
    </>

}


function DropZone({}){
    const [files, setFiles] = useState([])

    //on every drop get called with the files that were just added (not all the files in the dropzone), valid = passed validation
    const onDrop = useCallback((valid, invalid) => {
        const accepted = valid.map(file => ({file, errors: []}))
        setFiles(cur => [...cur, ...accepted, ...invalid])
    }, [])

    const {getRootProps, getInputProps} = useDropzone({onDrop})
    console.log(files)
    return <>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Place files or click to select from folder</p>
            {files.map((fileWrap, i) => {
                return <UploadSingleFile file={fileWrap.file} key={i}/>
            })}
        </div>
    </>
}



function UploadSingleFile({file}){
    console.log('uwu', file)
    //do upload when file recieved
    const [progress, setProgress] = useState(0)
    useEffect(() =>{
        // async function upload(){await uploadFile(file, setProgress)}
        // const url = upload().catch((err) =>{console.log('failed', err)})
    },[])

    return <>
    <div>
        {/* image preview */}
        <Preview file={file} />
        {`${progress} %`}
    </div>
    </>
}
function Preview({file}){
    const [preview, setPreview] = useState(null)
    useEffect(() =>{
        if(file){
            const reader = new FileReader()
            reader.onloadend = () => {setPreview(reader.result)}
            reader.readAsDataURL(file)
        }
        else{
            setPreview(null)
        }
    }, [file])

    return <div>
        {preview ? <Img src={preview} />:null}
    </div>
}
const uploadFile = async (file, setProgressBar) =>{
    console.log('called')
    return new Promise((resolve, reject) =>{
        const xhr = new XMLHttpRequest()

        //SETUP
        //update progress bar as it loads
        xhr.upload.onprogress = (event) => {
            //check if we can read the total file size
            console.log(event)
            if(event.lengthComputable){
                const current_progress = Math.round((event.loaded/event.total)*100)
                setProgressBar(current_progress)

            }
            else{setProgressBar('uploading')}
        }
        //once finished upload
        xhr.onload = () => {
            const res = JSON.parse(xhr.responseText)
            console.log('sucsess', res)
            resolve(res.secure_url)
        }

        //error occured
        xhr.onerror = (event) => reject(event)

        //EXECUTE REQUEST
        //construct and send form to cloudinary
        const formData = new FormData()
        formData.append('file', file)
        // formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
        formData.append('upload_preset', 'clientside')
        console.log('here', file)
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`
        xhr.open('POST', url)
        xhr.send(formData)

    })
}


UploadImages = memo(UploadImages)
export default UploadImages