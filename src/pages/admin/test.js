import {QueryClient, QueryClientProvider as QueryProvider, useQuery} from 'react-query'
import  {Formik, Field} from 'formik'
import axios from 'axios'
import { useState, useEffect } from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries:{
            // onSucsess: 
            // refetchInterval,
            // refetchIntervalInBackground,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }
    }
})

const Test = ({}) =>{
    return <>
        <GetImage />
    </>
}



const GetImage = ({}) =>{
    const [action, setAction] = useState('')
    const [images, setImages] = useState([])
    console.log(images)
    //command the upload image component to get rendered with the current image

    const submit = async(values) =>{
        setAction({
            type: 'images',
            payload: values.imageToUpload
        })
    }

    useEffect(() => {
        switch(action.type){
            case 'images': setImages([action.payload])
        }
    }, [action])

    useEffect(() => {
        if (images.length === 100){}
    }, [images])

    return <>
        <Formik initialValues={{"imageToUpload": null}} onSubmit={submit}>
            {({handleSubmit, setFieldValue}) => <>
            
                <form onSubmit={handleSubmit}>
                    <input 
                        type="file" 
                        name="imageToUpload" 
                        onChange={e => {setFieldValue("imageToUpload", e.target.files[0])                        }}
                    />
                    <button type="submit">submit</button>
                </form>

                <QueryProvider client={queryClient}>
                    {images.map((image, i) => <UploadImage image={image} action={action.type} key={i}/>)}
                </QueryProvider>

            </>}
        </Formik>

        
    </>
}

const upload = (file, setProgress) =>{
    console.log("'UPLOADING IMAGE'")
    return axios.post(
        'http://localhost:3000/api/uploadSingleImage', 
        {image: file}, 
        {headers: 
            {'Content-Type': 'multipart/form-data'},
            onUploadProgress: (e) => {
                const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) {
                    const progressData = [e.loaded, totalLength];
                    console.log(`progress: `,progressData)
                    setProgress(progressData)
                }
            }
        }
    )
}

//every time this component gets rendered it will upload an image then display it
const UploadImage = ({image, action}) => {
    console.log('rendering image', image)
    const [progress, setProgress] = useState([0, 0])
    const {data, isLoading, isError, isFetching, status} = useQuery(['image'], () => upload(image, setProgress), {
        enabled: action === 'images',
    })
    useEffect(() =>{
        console.log('data changed', data)
        if(data){
            //set values res url
            //set num_uploaded += 1
        }
    }, [data])
    console.log('status', status)
    if (isError){return <>WRONG</>}
    if (isLoading || isFetching){
        if(progress[0] === progress[1]){return <>OPTIMIZING</>}
        return <>LOADING: {progress[0]}/{progress[1]}</>
    }
    console.log('DATA', data)
    return <>OWO</>
}



export default Test