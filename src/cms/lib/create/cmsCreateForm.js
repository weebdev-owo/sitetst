import React, {memo, useRef, useState, useCallback, useEffect, useReducer, useMemo, createContext, useContext} from 'react'
import styles from './cms.module.sass'
import {Formik, useFormikContext} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';
import 'react-image-crop/dist/ReactCrop.css'
import {setBgCol} from '/src/cms/lib/utils/setbg'
import Upload from '/src/cms/lib/create/uploader'
import { ConfigContext } from './configContext'
// import { FormContext } from './formContext'
import get_imgs from '/src/cms/lib/utils/get_imgs'
import {getByPath, setByPath} from '/src/cms/lib/utils/byPath'

import {FormContextProvider, useFormContext} from '/src/cms/lib/utils/FormContext'

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
        isr_errors: []
    }
}
function uploadReducer(state, data){
    // console.log('reducer called', data)
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
            state.db.uploaded = true; 
            state.complete = {isr_errors: value}
            return {...state}

        case 'complete': 
            return { action: "complete", images: initialUploadStore.images, db: initialUploadStore.db,
                complete: {
                    isr_errors: state.complete.isr_errors
                }
            }
    }
}

function CmsCreateForm({initialValues, validationSchema, children, ...props}){

    const { imageUrl, dbUrl, cmsTitle, viewUrl, editUrl, cmsPath, id_path, revalidate, editText, viewText, createText, pageCms} = props
    const [uploadStore, setUpload] = useReducer(uploadReducer, initialUploadStore)

    //Change body background and scroll when ref onscreen
    useEffect(() =>{setBgCol(false)}, [])


    
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
    // console.log('IV', initialValues, validationSchema)
    return <>
        <div id={'Create'} className={styles["form-cont"]}>
            <ConfigContext.Provider value={{initialValues, ...props}}>
                <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={validationSchema}>{(formik) =>{console.log();return <>
                    {/* <ResetErrorScroll /> */}
                    <FormContextProvider >
                    <form className={styles["form"]} onSubmit={formik.handleSubmit} autoComplete="off">
                        <div className={styles["heading"]}>{`Create ${cmsTitle}`}</div>
                        { children }
                        <Upload store={uploadStore} update={setUpload} />

                        <div className={styles["submit-section"]}>
                            <button type="submit" disabled style={{display: "none"}} aria-hidden="true"></button>
                            <button type="submit" className={styles["submit"]}>{`Create ${cmsTitle}`}</button>   
                        </div>
                    </form>
                    </FormContextProvider>
                </>}}</Formik>
            </ConfigContext.Provider>
        </div>
    </>
}



CmsCreateForm = memo(CmsCreateForm)
CmsCreateForm.defaultProps = {
    imageUrl: '/api/cms/uploadImage',
    dbUrl: '/api/cms/create',
    validationSchema: Yup.object({}),
    viewUrl: (v)=>false, editUrl: (v)=>false,
    editText: (v)=>false, viewText: (v)=>false, createText: (v)=>false,
    revalidate: [],
}

export default CmsCreateForm