//frontend
import React, {memo, useRef, useState, useCallback, useEffect, useReducer, useMemo, createContext, useContext} from 'react'
import styles from './cms.module.sass'
import {Formik} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';
import 'react-image-crop/dist/ReactCrop.css'
import {setBgCol} from '/src/cms/lib/utils/setbg'
import Upload from './uploader'
import { ConfigContext } from './configContext'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery, useQueries} from 'react-query'
import Spinner from '/src/cms/lib/comps/spinner/spinner'
// import {initialUploadStore,  uploadReducer} from './uploader.js'



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

//requires 
function CmsEditForm({children, ...props}){
    useEffect(()=>{setBgCol(false)},[])
    const [queryClient, setQueryClient] = useState(new QueryClient({
        defaultOptions: {
            queries:{
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    }))

    return <>
        <QueryProvider client={queryClient} >
            <EditServiceWithQuery {...props}>
                {children}
            </EditServiceWithQuery>
        </QueryProvider>
    </>
}

async function fetchImg(url){
    const res = await fetch(url)
    return res.blob()
}
function calc_queries(data, updateImg){
    const img_paths = get_imgs(data, [], [])

    return img_paths.map(path =>{
        return {
            queryKey: ['image', path],
            queryFn: () => {
                const img_url = getByPath(data, path)['url']
                return fetchImg(img_url)
            },
            onSuccess: (img_file) => {updateImg([path, img_file])},
            onError: () => {updateImg([path, null])}
        }
    })
}
function intialValuesReducer(state, [path, value]){
    setByPath(state, path.concat(['original']), value)
    setByPath(state, path.concat(['cropped']), value)
    // console.log(state, path, value)
    return {...state}
}
function EditServiceWithQuery({data, children, ...props}){
    const [initialValues, setInitialValues] = useReducer(intialValuesReducer, JSON.parse(JSON.stringify(data)))
    const [imgLoadComplete, setImgLoadComplete] = useState(false)
    const imgs = useQueries(calc_queries(initialValues, setInitialValues))
    // useEffect(()=>{setBgCol(false)},[])
    useEffect(() =>{ 
        if (imgs.every(img => (img.status === 'success' ||  img.status === 'error'))){setImgLoadComplete(true)}
    }, [initialValues])

    if(imgLoadComplete){ return <>
        <CmsEditFormInner initialValues={initialValues} {...props}>
            {children}
        </CmsEditFormInner>

    </>}
    else{ return <>
        <div className={styles['loading-initial-data-cont']}>
            <div className={styles['loading-initial-data']}>
                <p>LOADING DATA</p>    
                <Spinner h={'8vw'}/>
            </div>
        </div>
    </>}
}

const initialUploadStore = {
    
    action: "",

    images: {
        // enabled: false, //enables display
        num_uploaded: 0, //complete when num_uploaded === files.length
        files: [], //triggers upload
        paths: [],
        uploaded: false,
        error: false
    },

    db: { //triggered by image upload completion
        uploaded: false,
        error: false
    },

    complete: {
        isr_errors: [],
        unique_id: null
    }
}
function uploadReducer(state, data){
    console.log('reducer called', data)
    const assign = typeof data === 'string'
    const action = assign ? data:data[0]
    const value = assign ? null:data[1]

    switch (action){
        case 'reset': return initialUploadStore
        case 'close': return initialUploadStore

        case 'images':
            return { action: "images", db: initialUploadStore.db, complete: initialUploadStore.complete,
                images: {
                    num_uploaded: 0,
                    files: value[0],
                    paths: value[1],
                    uploaded: false,
                    error: false
                },
            }
        case 'image_error': state.images.error = true; return {...state}
        case 'image_sucsess':
            state.images.num_uploaded += 1
            state.images.uploaded = state.images.files.length <= state.images.num_uploaded
            return {...state}

        case 'db': 
            return { action: "db", images: initialUploadStore.images, complete: initialUploadStore.complete,
                db: {
                    uploaded: false,
                    error: false,
                }
            }
        case 'db_error': state.db.error = true; return {...state}
        case 'db_sucsess': 
            console.log('HEREEEEE', value[1])
            state.db.uploaded = true; 
            state.complete = {
                isr_errors: value[0],
                unique_id: value[1]
            }

            return {...state}

        case 'complete': 
            return { action: "complete", images: initialUploadStore.images, db: initialUploadStore.db,
                complete: {
                    isr_errors: state.complete.isr_errors,
                    unique_id: state.complete.unique_id,
                }
            }
    }
}
function CmsEditFormInner({initialValues, validationSchema, imageUrl, dbUrl, cmsTitle, viewUrl, editUrl, cmsPath, id_path, revalidate, editText, viewText, createText, children, pageCms}){


    const [uploadStore, setUpload] = useReducer(uploadReducer, initialUploadStore)

    //Change body background and scroll when ref onscreen
    // useEffect(() =>{setBgCol(false)}, [])
    
    const sendToAPI = async (values) => {
        console.log('submmiting', values)
  
        //scan values for the key "img*"
        let paths = get_imgs(values, [], [])
        const upload_paths = []
        paths.forEach((path) =>{
            if (!getByPath(values, path)['url']){upload_paths.push(path)}
        })

        if(upload_paths.length){
            const images = upload_paths.map((path) => getByPath(values, path)['cropped'])
            setUpload(['images', [images, upload_paths]])
        }
        else{
            setUpload('db')
        }
    }

    return <>
        <div id={'Create'} className={styles["form-cont"]} >
            <ConfigContext.Provider value={{imageUrl, dbUrl, cmsTitle, viewUrl, editUrl, cmsPath, id_path, revalidate, initialValues, editText, viewText, createText, pageCms}}>
                <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={validationSchema}>{(formik) =>{console.log();return <>
                    <form className={styles["form"]} onSubmit={formik.handleSubmit} autoComplete="off">
                        <div className={styles["heading"]}>{`Edit ${cmsTitle}`}</div>
                        { children }
                        <Upload store={uploadStore} update={setUpload}/>
                        <div className={styles["submit-section"]}>
                            <button type="submit" disabled style={{display: "none"}} aria-hidden="true"></button>
                            <button type="submit" className={styles["submit"]}>{`Edit ${cmsTitle}`}</button>   
                        </div>
                    </form>
                </>}}</Formik>
            </ConfigContext.Provider>
        </div>
    </>
}

CmsEditFormInner = memo(CmsEditFormInner)
CmsEditFormInner.defaultProps = {
    imageUrl: '/api/uploadSingleImage',
    dbUrl: '/api/cmsEdit',
    validationSchema: Yup.object({}),
    viewUrl: (v)=>false, editUrl: (v)=>false,
    editText: (v)=>false, viewText: (v)=>false, createText: (v)=>false,
    revalidate: [],
}

async function getFormData(id, id_path, Model){
    let data = false
    try {
        data = await Model.find()
            .select(['data'])
            .where(`data.${id_path}`).eq(id)
        if (data.length !== 1){throw 'Invalid number of objects matching this id'}
        // console.log('inside server side props', data[0].data)
        const initialValues = data[0].data
        
        return {
            props: {
                data: JSON.parse(JSON.stringify(initialValues))
            }
        }
    } 
    catch (error) {
        console.log('inside get props error', error)
        return {notFound: true}
    }
}


export {getFormData}
export default CmsEditForm



