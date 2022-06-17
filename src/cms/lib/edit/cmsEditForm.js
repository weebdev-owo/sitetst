import React, {memo, useRef, useState, useCallback, useEffect, useReducer, useMemo, createContext, useContext} from 'react'
import styles from './cms.module.sass'
import {Formik} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';
import 'react-image-crop/dist/ReactCrop.css'
import {SetBgInv} from '/src/cms/lib/utils/setbg'
import Upload from './uploader'
import { ConfigContext } from './configContext'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery, useQueries} from 'react-query'
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

    useEffect(() =>{ 
        if (imgs.every(img => (img.status === 'success' ||  img.status === 'error'))){setImgLoadComplete(true)}
    }, [initialValues])

    if(imgLoadComplete){ return <>
        <CmsEditFormInner initialValues={initialValues} {...props}>
            {children}
        </CmsEditFormInner>

    </>}
    else{ return <>
        LOADING IMAGES
    </>}
}


function CmsEditFormInner({initialValues, validationSchema, imageUrl, dbUrl, cmsTitle, viewUrl, editUrl, model_path, id_path, revalidate, children}){
    const [startUpload, setStartUpload] = useState(false)

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBgInv(elemRef)
    
    const sendToAPI = async (values) => {
        console.log('submmiting', values)
        setStartUpload(true)
    }

    return <>
        <div id={'Create'} className={styles["form-cont"]} ref={elemRef}>
            <ConfigContext.Provider value={{imageUrl, dbUrl, cmsTitle, viewUrl, editUrl, model_path, id_path, revalidate}}>
                <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={validationSchema}>{(formik) =>{console.log();return <>
                    <form className={styles["form"]} onSubmit={formik.handleSubmit} autoComplete="off">
                        <div className={styles["heading"]}>{`Edit ${cmsTitle}`}</div>
                        { children }
                        <Upload startUpload={startUpload} setStartUpload={setStartUpload} initialUrlId={getByPath(initialValues, id_path)}/>
                        <div className={styles["submit-section"]}>
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
    viewUrl: false,
    editUrl: false,
    revalidate: [],
}



export default CmsEditForm



