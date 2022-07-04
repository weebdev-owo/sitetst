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


const getByPath = (obj, path) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}
const setByPath = (obj, path, val) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((entry) =>{res = res[entry]})
    res[final] = val
}

let num_images = 0;
function unique_query_id(){
    num_images += 1
    return `image${num_images}`
}

const isImg = new RegExp('^img', 'i')
function get_imgs(data, path, paths){  
    if (typeof data === 'object' && data != null){
        if (Array.isArray(data)){   //array
            for(let i=0; i<data.length; i++){
                get_imgs(data[i], path.concat([i]), paths)
            }
        }
        else {  
            const keys = Object.keys(data) //object
            for (let i=0; i<keys.length; i++){
                if (isImg.test(keys[i])){paths.push(path.concat([keys[i]]))}
                else {get_imgs(data[keys[i]], path.concat([keys[i]]), paths)}
            }
        }
    }
    return paths
}

//give me a upload store and an update reducer and a formik values object, and ill do some image uploads to cloudinary, then mutate values, and then send the modified values to a database
function Upload({store, update, initialUrlId}){
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries:{
                // onSucsess: 
                // refetchInterval,
                // refetchIntervalInBackground,
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    }), [])

    const { values, errors } = useFormikContext()
    console.log("CURRENT VALUES", 
        values, 
        errors,
        // values.service.process.steps, 
        // values.service.faq.items
    )   

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
    const {data, isLoading, isError, isFetching, isRefetching, status, error} = useQuery('image', () => postImage(file, setProgress, imageUrl), {enabled: !sucsess && !failed})

    useEffect(() =>{
        if(data && !isError){ setByPath(values, path.concat(['url']), data.data.url); update('image_sucsess')}
    }, [data, isError])

    useEffect(() =>{
        if(isError){ update('image_error') }
    }, [isError])

    //create image and rember it
    const image = useMemo(() => <ContainFileImage file={file}/>, [file])

    //display response error
    if (isError){
        console.log('ERROR UPLOADING FILE: ', file.name, error)
        return <>
            <div>
                {image}
                <div className={styles['upload-image-error']}>{`${error.response.data.message || error.response.message}`}</div>
            </div> 
        </>
    }

    //display request in progress
    if (isLoading){

        //optimizing
        if(progress[0] === progress[1]){
            return <>
                <div>
                    {image}
                    <div className={styles['upload-image-optimizing']}>
                        <div className={styles['upload-image-optimizing-text']}>{`Optimizing`}</div>
                        <Spinner h={20} />
                    </div>
                </div>
 
            </>             
        }

        //progress
        else{
            return <>
                <div>
                    {image}
                    <ProgressBar progress={progress} />
                </div>
            </>
        }
        
    }

    //display response sucsess
    return <>
        <div>
            {image}
            <div className={styles['upload-image-optimizing']}>
                <div className={styles['upload-image-optimizing-text']}>{`Uploaded`}</div>
            </div>
        </div>
    </>

}; UploadImage = memo(UploadImage)

//upload data and display
function createPayload(values){
    const payload = JSON.parse(JSON.stringify(values))
    const paths = get_imgs(payload, [], [])
    for (const path of paths){
        const img = getByPath(values, path)
        setByPath(payload, path, {
            url: img['url'],
            alt: img['alt']
        })
    }
    console.log('PAYLOAD', payload)
    return payload
}

async function postData(payload, setProgress, url, cmsPath, unique_id, revalidate, url_ids){
    const revalidate_paths = revalidate.map((revalidate_path) => {
        if (typeof revalidate_path === 'string'){ return revalidate_path}
        const new_revalidate_path = revalidate_path.map(entry => (entry === 'use id' ? unique_id:entry))
        return '/'+new_revalidate_path.join('/')
    })
    // console.log('UPLOADING DATA', revalidate_paths)
    console.log('hmhmhmhmhmhmhmh', url_ids)
    return axios.post(
        url, 
        {
            data: payload,
            model_path: cmsPath,
            revalidate: revalidate_paths,
            url_ids: url_ids
        }, 
        {headers: 
            {'Content-Type': 'application/json'},
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

function UploadData({sucsess, failed, update}){
    
    //close if already tried request and component refreshed
    let close = false
    useEffect(()=>{if(sucsess || failed){update('close')}; close=true}, [])
    useToggleScroll(!close)

    const { values } = useFormikContext()
    const {dbUrl, cmsPath, id_path, revalidate, initialValues} = useContext(ConfigContext)
    const [progress, setProgress] = useState([0, 0])
    const url_ids = {
        initial: getByPath(initialValues, id_path),
        path: id_path
    }
    const {data, isLoading, isError, isFetching, isRefetching, status, error} = useQuery('data', () => postData(createPayload(values), setProgress, dbUrl, cmsPath, getByPath(values, id_path), revalidate, url_ids), {enabled: !sucsess && !failed})

    useEffect(() =>{
        if(data && !isError){ update(['db_sucsess', [data.data.isr_errors, getByPath(data.data.data.data, id_path)]]) }
    }, [data, isError])

    useEffect(() =>{
        if(isError){ update('db_error') }
    }, [isError])

    if(close){ return null }

    if(isError){
        // console.log('ERROR UPLOADING DATA', error)
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

    // console.log("COMPLETED DATA UPLOAD", data)
    return <>
        <div className={styles['heading']}>{'Uploading Data to Server'}</div>
        <div className={styles['upload-data-inprogress']}>
            <div className={styles['upload-data-inprogress-text']}>{`Complete`}</div>
        </div>
    </>

}; UploadData = memo(UploadData)

//upload complete menu 
function UploadComplete({isrErrors, uniqueId}){
    const { values, setFieldValue, submitCount, setFieldTouched } = useFormikContext()
    const {cmsTitle, cmsPath, viewUrl, editUrl, id_path, initialValues, editText, viewText, createText, pageCms} = useContext(ConfigContext)

    const router = useRouter()
    useEffect(() =>{
        if(!pageCms){
            const href = `/admin/${cmsPath}/edit/${uniqueId}`
            router.push(href)
        }
    }, [])
    const forceReload = async (e) =>{
        e.preventDefault()
        router.reload()
    }
    useToggleScroll(true)
    
    return <>
        <div className={styles['heading']} style={{"color":'#39C16C'}}>Upload Sucsess</div>
        {isrErrors.length ? <div className={styles['sub-heading']}>{`ISR error, changes will not be reflected immediately`}</div>:null}
        {isrErrors.length ? <div className={styles['upload-data-errors']}>{isrErrors.map((path, i) => 
            <div key={i}><span className={styles['upload-data-error']}>{` on demand isr failed for page: [ ${path} ] hence changes will not be displayed immediately`}</span></div>
        )}</div>:null}  
        {uniqueId && <div className={styles['sucsess-links']}>
            <div className={styles["sucsess-section"]}>
                <Link href={'/admin'}>
                    <a className={styles["sucsess-link"]}>Admin Home</a> 
                </Link>   
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={viewUrl(values) || `/${cmsPath}/${uniqueId}`}>
                    <a className={styles["sucsess-link"]}>{viewText(values) || `View ${uniqueId}`}</a> 
                </Link>  
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={editUrl(values) || `/admin/${cmsPath}/edit/${uniqueId}`}>
                    <a className={styles["sucsess-link"]} onClick={forceReload}>{editText(values) || `Edit ${uniqueId}`}</a> 
                </Link>     
            </div>

            {!pageCms ?<div className={styles["sucsess-section"]}>
                <Link href={`/admin/${cmsPath}/create`}>
                    <a className={styles["sucsess-link"]}>{createText(values) || `Create New ${cmsTitle}`}</a> 
                </Link>     
            </div>:null}
        </div>}
    </>
} UploadComplete = memo(UploadComplete)

//progress bar
function ProgressBar({progress}){
    let [loaded, total] = progress
    let unit = ''
    if (total>100000){
        loaded = (loaded/1000000).toFixed(2)
        total = (total/1000000).toFixed(2)
        unit='mb'
    }
    else if(total>100) {
        loaded = (loaded/1000).toFixed(2)
        total = (total/1000).toFixed(2)
        unit='kb'
    }
    else{
        loaded = (loaded/1).toFixed(2)
        total = (total/1).toFixed(2)
        unit='bytes'
    }
    return <>
        <div className={styles['progress-uploading']}>
            <Bar progress={Math.floor((loaded*100)/total)} />
            <div>{`${loaded}/${total} ${unit}`}</div>
        </div>
    </>


}

function Bar({progress}){
    return <>
        <div style={{
            height: '5px', 
            width: '200px',
            backgroundColor: 'black',
            borderRadius: '20px',
            border: '1px solid white'
        }}>
            <div style={{
                height: '100%', 
                width: `${progress}%`,
                backgroundColor: 'white',
                borderRadius: '20px'
            }}>

            </div>
        </div>
    </>
}

export default Upload