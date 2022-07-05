import React, {memo, useRef, useState, useCallback, useEffect, useReducer, useMemo, useContext} from 'react'
import styles from './cms.module.sass'
import {useFormikContext} from 'formik'
import  classNames  from 'classnames';
import ContainFileImage from '/src/cms/lib/utils/preview/containFileImage'
import useToggleScroll from '/src/cms/lib/utils/toggleScroll'
import axios from 'axios'
import Spinner from '/src/cms/lib/comps/spinner/spinner'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery} from 'react-query'
import { ConfigContext } from './configContext'
import ProgressBar from '/src/cms/lib/comps/ProgressBar/ProgressBar'
import get_imgs from '/src/cms/lib/utils/get_imgs'
import {getByPath, setByPath} from '/src/cms/lib/utils/byPath'
import createPayload from '/src/cms/lib/utils/createPayload'


//give me a upload store and an update reducer and a formik values object, and ill do some image uploads to cloudinary, then mutate values, and then send the modified values to a database
function Upload({store, update}){
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries:{
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    }), [])

    const { values, errors } = useFormikContext()
    console.log("CURRENT VALUES", values, errors)   

    useEffect(() =>{
        if(store.images.uploaded){
            update('db')
        }
    }, [store.images.uploaded])

    useEffect(() =>{
        if(store.db.uploaded){
            update('complete')
        }
    }, [store.db.uploaded])

    if(store.action==='images'){
        return <>
            {/* <QueryProvider client={queryClient}> */}
                <div className={styles['crop-modal']}>
                    <UploadImages 
                        files={store.images.files} 
                        paths={store.images.paths}
                        error={store.images.error} 
                        uploaded={store.images.uploaded}
                        update={update} 
                    />
                </div>
            {/* </QueryProvider> */}
        </>
    }
    if(store.action==='db'){
        return <>
            <QueryProvider client={queryClient}>
                <div className={styles['crop-modal']}>
                    <UploadData 
                        sucsess={store.db.uploaded}
                        failed={store.db.error}
                        update={update} 
                    />
                </div>
            </QueryProvider>
        </>
    }
    if(store.action==='complete'){
        return <>
            <QueryProvider client={queryClient}>
                <div className={styles['crop-modal']}>
                    <UploadComplete isrErrors={store.complete.isr_errors} uniqueId={store.complete.unique_id}/>
                </div>
            </QueryProvider>
        </>
    }
    return null
}

//upload images and display
function UploadImages({files, paths, error, uploaded, update}){
    //close if already tried request and component refreshed
    let close = false
    useEffect(()=>{if(uploaded || error){update('close')}; close=true}, [])
    useToggleScroll(!close)

    const images = useMemo(() => {
        if(files.length){
            return files.map((image, i) => {
                const imgClient = new QueryClient({ defaultOptions: {queries:{refetchOnMount: false,refetchOnReconnect: false,refetchOnWindowFocus: false, retry: false}}});
                return <>
                    <QueryProvider client={imgClient}>
                        <UploadImage 
                            file={image} 
                            path={paths[i]} 
                            update={update} 
                            sucsess={uploaded} 
                            failed={error} 
                            key={i}
                        />
                    </QueryProvider>
                </>
            })
        }
        else {return []}
    }, [files])

    if(close){ return null }

    if (!error){
        return <>
            <div className={styles['heading']}>{'Uploading Images'}</div>
            <div className={styles['upload-images-display']}>{images}</div>
        </>
    }
    else{
        return <>
            <div className={styles['heading']}>{'Error Uploading Images'}</div>
            <div className={styles['sub-heading']}>{`check server status and configuration`}</div>
            <button type="button" className={styles["upload-close"]} onClick={()=>{update('close')}}>{'\u2715'}</button>
            <div className={styles['upload-images-display']}>{images}</div>
        </>
    }

}; UploadImages = memo(UploadImages)

const postImage = (file, setProgress, url) =>{
    // console.log("UPLOADING IMAGEU: ", file.name)
    return axios.post(
        url, 
        {image: file}, 
        {headers: 
            {'Content-Type': 'multipart/form-data'},
            onUploadProgress: (e) => {
                const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) {
                    const progressData = [e.loaded, totalLength];
                    setProgress(progressData)
                }
            }
        }
    )
}

function UploadImage({file, path, sucsess, failed, update}) {
    // console.log('IMAGE FILE', path, file)
    const { values } = useFormikContext()
    const {imageUrl} = useContext(ConfigContext)
    const [progress, setProgress] = useState([0, 0])
    const {data, isLoading, isError, error} = useQuery('image', () => postImage(file, setProgress, imageUrl), {
        enabled: !sucsess && !failed,
        onSuccess: (data) => {setByPath(values, path.concat(['url']), data.data.url); update('image_sucsess')},
        onError: () => {update('image_error')}
    })

    //create image and rember it
    const image = useMemo(() => <ContainFileImage file={file}/>, [file])

    //display response error
    if (isError){ console.log('ERROR UPLOADING FILE: ', file.name, error);
        return <><div>
                {image}
                <div className={styles['upload-image-error']}>{`${error.response.data.message || error.response.message}`}</div>
        </div></>
    }

    //display request in progress
    if (isLoading){
        //optimizing
        if(progress[0] === progress[1]){ return <> <div>
            {image}
            <div className={styles['upload-image-optimizing']}>
                <div className={styles['upload-image-optimizing-text']}>{`Optimizing`}</div>
                <Spinner h={20} />
            </div>
        </div></>}
        //progress
        else { return <><div>
            {image}
            <ProgressBar progress={progress} />
        </div></>}
    }

    //display response sucsess
    return <><div>
        {image}
        <div className={styles['upload-image-optimizing']}>
            <div className={styles['upload-image-optimizing-text']}>{`Uploaded`}</div>
        </div>
    </div></>

}; UploadImage = memo(UploadImage)

async function postData(values, config, setProgress){
    const {dbUrl, modelPath, validationPath, revalidate, idPath} = config
    const payload = createPayload(values)
    const uniqueId = getByPath(payload, idPath)
    const revalidatePaths = revalidate.map((revalidatePath) => {
        if (typeof revalidatePath === 'string'){ return revalidatePath}
        const new_revalidate_path = revalidatePath.map(entry => (entry === 'use id' ? uniqueId:entry))
        return '/'+new_revalidate_path.join('/')
    })
    console.log('RERERERE', revalidatePaths)

    return axios.post(
        dbUrl, 
        {
            data: payload,
            newId: uniqueId,
            idPath: idPath,
            modelPath: modelPath,
            validationPath: validationPath,
            revalidatePaths: revalidatePaths,
        }, 
        {
            headers: {'Content-Type': 'application/json'},
            onUploadProgress: (e) => {
                const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) setProgress([e.loaded, totalLength])
            }
        }
    )
}

function UploadData({sucsess, failed, update}){
    
    //close if already tried request and component refreshed
    let close = false
    useEffect(()=>{if(sucsess || failed){update('close')}; close=true}, [])
    useToggleScroll(!close)

    const {values} = useFormikContext()
    const config = useContext(ConfigContext)
    const {idPath} = config
    const [progress, setProgress] = useState([0, 0])

    const {data, isLoading, isError, error} = useQuery('data', () => postData(values, config, setProgress), {
        enabled: !sucsess && !failed,
        onSuccess: (data) => update(['db_sucsess', data.data.isr_errors]),
        onError: () => update('db_error')
    })

    if(close){ return null }

    if(isError){
        console.log('ERROR UPLOADING DATA', error)
        const types = error.response.data.error.types
        const messages = error.response.data.error.messages
        return <>
            <div className={styles['heading']}>{'Error Uploading Data to Server'}</div>
            {types.validation ? <div className={styles['sub-heading']}>{`change form data`}</div>:null}
            {types.server ? <div className={styles['sub-heading']}>{`check server status and configuration`}</div>:null}
            <div className={styles['upload-data-errors']}>{messages.map((message, i) => 
                <span className={styles['upload-data-error']} key={i}>{`${message}`}</span>
            )}</div>
            <button type="button" className={styles["upload-close"]} onClick={()=>{update('close')}}>{'\u2715'}</button>
        </>
    }

    if(isLoading){
        return <>
            <div className={styles['heading']}>{'Uploading Data to Server'}</div>
            <div className={styles['upload-data-inprogress']}>
                {progress[0]<progress[1] ? 
                    <div className={styles['upload-data-inprogress-text']}>{`Uploading Data`}</div>
                :
                    <div className={styles['upload-data-inprogress-text']}>{`Rebuilding Pages`}</div>
                }
                <Spinner h={60}/>
            </div>
            <div className={styles['center-progress']}><ProgressBar progress={progress} /></div>
        </>
    }

    return <>
        <div className={styles['heading']}>{'Uploading Data to Server'}</div>
        <div className={styles['upload-data-inprogress']}>
            <div className={styles['upload-data-inprogress-text']}>{`Complete`}</div>
        </div>
    </>

}; UploadData = memo(UploadData)

//upload complete menu 
function UploadComplete({isrErrors}){
    const { values, setFieldValue, submitCount, setFieldTouched } = useFormikContext()
    const {cmsTitle, cmsPath, viewUrl, editUrl, idPath, editText, viewText, createText, pageCms} = useContext(ConfigContext)
    const router = useRouter()
    const forceReload = () =>{
        router.reload()
    }
    useToggleScroll(true)

    return <>
        <div className={styles['heading']} style={{"color":'#39C16C'}}>Upload Sucsess</div>
        {isrErrors.length ? <div className={styles['sub-heading']}>{`ISR error, changes will not be reflected immediately`}</div>:null}
        {isrErrors.length ? <div className={styles['upload-data-errors']}>{isrErrors.map((path, i) => 
            <div key={i}><span className={styles['upload-data-error']}>{` on demand isr failed for page: [ ${path} ] hence changes will not be displayed immediately`}</span></div>
        )}</div>:null}  
        <div className={styles['sucsess-links']}>
            <div className={styles["sucsess-section"]}>
                <Link href={'/admin'}>
                    <a className={styles["sucsess-link"]}>Admin Home</a> 
                </Link>   
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={viewUrl(values) || `/${cmsPath}/${getByPath(values, idPath)}`}>
                    <a className={styles["sucsess-link"]}>{viewText(values) || `View ${getByPath(values, idPath)}`}</a> 
                </Link>  
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={editUrl(values) || `/admin/${cmsPath}/edit/${getByPath(values, idPath)}`}>
                    <a className={styles["sucsess-link"]}>{editText(values) || `Edit  ${getByPath(values, idPath)}`}</a> 
                </Link>     
            </div>

            {!pageCms ?<div className={styles["sucsess-section"]}>
                <Link href={`/admin/${cmsPath}/create`}>
                    <a className={styles["sucsess-link"]} onClick={forceReload}>{createText(values) || `Create New ${cmsTitle}`}</a> 
                </Link>     
            </div>:null}
        </div>
    </>
} UploadComplete = memo(UploadComplete)

export default Upload