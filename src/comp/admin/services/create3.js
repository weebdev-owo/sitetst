import React, {memo, useRef, useState, useCallback, useEffect, useReducer} from 'react'
import styles from './create.module.sass'
import {useField, useFormikContext, useFormik, Formik,getIn} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';
import { useDropzone } from "react-dropzone"
import 'react-image-crop/dist/ReactCrop.css'
import CropImage from '/src/lib/image/crop/cropImageForm'
import FileImage from '/src/lib/image/preview/fileImage'
import ContainFileImage from '/src/lib/image/preview/containFileImage'
import {SetBgInv} from '/src/lib/utils/setbg'
import useToggleScroll from '/src/lib/utils/toggleScroll'
import image_styles from '/src/styles/images.module.sass'
import axios from 'axios'
import serviceSchema from '/src/lib/validations/service'
import Spinner from '/src/lib/comps/spinner/spinner'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {QueryClient, QueryClientProvider as QueryProvider} from 'react-query'

const queryClient = new QueryClient()

let cnt = 0
// import uploadImage from '/src/lib/utils/uploadImage'

//layout form data
const img = {
    "original": null,
    "cropped": null,
    "url": "",
    "alt": "edit for better seo"
}
const step = {
    "name": "",           
    "desc": "",
    "img": img,
}
const question = {
    "question": "",           
    "answer": "",
}

const initialValues2 = {
    "url": "",
    "enabled": true,
    "booking":true,
    services: {
        tile: {
            "order":"",
            "name":"",
            "desc":"",
            "img": img,
        },
    },
    service:{
        intro: {
            "name":"",
            "desc":"",
            "img": img,
        },
        summary: {
            "s1":"",
            "s2":"",
            "s3":"",
            "img1": img,
            "what":"",
            "img2": img,
            "why":"",
            "img3": img,
        },
        process:{
            "intro":"",
            "steps": [],
        },
        faq: {
            "intro":"",
            "items": [],
        },
    },
    

    "isEditorOpen": false,
    "editorFileName": "",
    "editorPreviewStyle": null,

    'isSubmitOpen': false,

}
const yup_validation2 = Yup.object({})
const initialValues = {
    "url": "thrh",
    "enabled": true,
    "booking": true,
    "services": {
        "tile": {
            "order": "4",
            "name": "drh",
            "desc": "drgh",
            "img": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        }
    },
    "service": {
        "intro": {
            "name": "drgh",
            "desc": "drh",
            "img": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        },
        "summary": {
            "s1": "drh",
            "s2": "drh",
            "s3": "drh",
            "img1": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            },
            "what": "drh",
            "img2": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            },
            "why": "drh",
            "img3": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        },
        "process": {
            "intro": "drh",
            "steps": [
                {
                    "name": "drh",
                    "desc": "drh",
                    "img": {
                        "original": null,
                        "cropped": null,
                        "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                        "alt": "edit for better seo"
                    }
                }
            ]
        },
        "faq": {
            "intro": "drh",
            "items": [
                {
                    "question": "drh",
                    "answer": "drh"
                },
                {
                    "question": "drg",
                    "answer": "rg"
                }
            ]
        }
    },
    "isEditorOpen": false,
    "editorFileName": "",
    "editorPreviewStyle": null,
    "isSubmitOpen": false
}

const getImg = (obj, path) => {
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}
const setImg = (obj, path, newval) => {
    let res = obj
    console.log(path)
    const final = path.pop()
    path.forEach((entry) =>{res = res[entry]})
    res[final] = newval
}

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

//reducers for stores
const initialEditor = {
    open: false,
    fileName: "",
    previewStyle: null,
}
function editorReducer(state, action, value=null){
    switch (action){
        case 'open': state.open = value; return state
        case 'fileName': state.fileName = value; return state
        case 'previewStyle': state.previewStyle = value; return state
        default: throw new Error()
    }
}

const initialUploadDisplay = {
    action: "",

    images: {
        enabled: false,
        num_uploaded: 0,
        begin: 0,
        files: [],
        errors: [],
        actions: [],
    },

    db: {
        enabled: false,
        errors: [],
        errorTypes: {
            validation: false, 
            types: false
        }
    },

    complete: {
        enabled: false
    }
}

function uploadDisplayReducer(state, action, value=null){
    switch (action){
        case 'reset': return initialUploadDisplay
        case 'upload images':
            const upload_paths = value
            return {
                action: "",
                images: {
                    begin: 0,
                    files: [],
                    errors: [],
                    actions: [],
                },
                db: state.db
            }
            

        case 'update db':
    }
}

const intialUploadDisplayProgress = {
    progress: []
}

function uploadDisplayProgressReducer(state, action, value=null){
    
}

const deepcopy = (obj) => JSON.parse(JSON.stringify(obj))


function Create(){
    const [editorStore, setEditor] = useReducer(editorReducer, initialEditor)
    const [uploadDisplayStore, setUploadDisplay] = useReducer(uploadDisplayReducer, initialUploadDisplay)
    const [imageProgressStore, setImageProgress] = useReducer(uploadDisplayProgressReducer, deepcopy(intialUploadDisplayProgress))
    const [dbProgressStore, setdbProgress] = useReducer(uploadDisplayProgressReducer, deepcopy(intialUploadDisplayProgress))

    //upload display
    const [beginUpload, setBeginUpload] = useState(0)
    //images
    const [uploadImages, setUploadImages] = useState([])
    const [uploadImagesProgress, setUploadImagesProgress] = useState([])
    const [uploadImagesErrors, setUploadImagesErrors] = useState([])
    const [uploadActions, setUploadActions] = useState([])
    const [uploadAction, setUploadAction] = useState([])
    //database
    const [uploadDataErrors, setUploadDataErrors] = useState([])
    const [uploadDataErrorTypes, setUploadDataErrorTypes] = useState({validation: false, types: false})
    const [uploadDataProgress, setUploadDataProgress] = useState([0,0])

    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBgInv(elemRef)

    const upload_image = useCallback(async (img, i) => {
        console.log('uploading', i)
        try{
            console.log('uploaddd strt', i)
            const res = await axios.post(
                'http://localhost:3000/api/uploadSingleImage', 
                {image: img['cropped']}, 
                {headers: 
                    {'Content-Type': 'multipart/form-data'},
                    onUploadProgress: (e) => {
                        const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength !== null) {
                            const progressData = [e.loaded, totalLength];
                            console.log(`progress: `,progressData)
                            setUploadImagesProgress((progress) =>{
                                const data = [...progress]
                                data[i] = progressData
                                return data
                            })
                        }
                    }
                }
            )
            console.log('uploaded', i, res.data)
            img['url'] =  res.data.url
            setUploadActions((actions) =>{
                const data = [...actions]
                data[i] = 'uploaded'
                return data
            })
            return true
        }
        catch (e){
            console.log(`error uploading ${i}`, e)
            setUploadImagesErrors((errs) =>{
                const data = [...errs]
                data[i] = e
                return data
            })
            return false
        }
    }, [])
    
    const sendToAPI = async (values) => {
        console.log('submmiting', values)
        setBeginUpload(beginUpload+1)
        

        //IMAGES UPLOAD
        let image_sucsess = true
        let data_sucsess = false

        //scan values for the key "img*"
        let paths = get_imgs(values, [], [])
        const upload_paths = []
        paths.forEach((path) =>{
            if (!getByPath(values, path)['url']){upload_paths.push(path)}
        })
        console.log('upload paths', paths, upload_paths)

        //SETUP DISPLAY
        //images
        setUploadImages(upload_paths.map(path => getByPath(values, path)['cropped']))
        setUploadImagesProgress(upload_paths.map(() => [0,0]))
        setUploadActions(upload_paths.map(() => 'uploading'))
        setUploadImagesErrors(upload_paths.map(() => false))
        //data
        setUploadDataErrors([])
        setUploadDataErrorTypes({validation: false, types: false})
        setUploadDataProgress([0,0])

        //do image uploads if required
        
        if(upload_paths.length){
            setUploadAction('images')
            // send images to api
            try{
                const uploaded_images = await Promise.all(upload_paths.map(async (path, i) => upload_image(getByPath(values, path), i)))
                for (const res of uploaded_images){if(!res){throw 'failed to upload'}}
                console.log('Upload Sucsess', uploaded_images)
            }
            catch (e){
                console.log('Error uploading images', e)
                image_sucsess = false
            }
        }

        console.log('upload paths2', upload_paths)

        //DB UPLOAD
        if(image_sucsess){
            setUploadAction('db')
            //clone and modify form data
            const payload = JSON.parse(JSON.stringify(values))
            for (const path of paths){
                const img = getByPath(values, path)
                setByPath(payload, path, {
                    url: img['url'],
                    alt: img['alt']
                })
            }
            delete payload["isEditorOpen"]
            delete payload["editorFileName"]
            delete payload["editorPreviewStyle"]
            delete payload["isSubmitOpen"]
            console.log('modified payload', payload)

            //send data to api
            try{
                const res = await axios.post(
                    'http://localhost:3000/api/cmsCreate', 
                    {data: payload}, 
                    {headers: 
                        {'Content-Type': 'application/json'},
                        onUploadProgress: (e) => {
                            const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                            if (totalLength !== null) {
                                const progressData = [e.loaded, totalLength];
                                console.log(`progress: `,progressData)
                                setUploadDataProgress(progressData)
                            }
                        }
                    }
                )
                data_sucsess = true
            }
            catch (err) {
                const messages = err.response.data.error.messages
                const types = err.response.data.error.types
                console.log('error uploading data', err)
                setUploadDataErrorTypes({...types})
                setUploadDataErrors([...messages])
            }
        }

        if(data_sucsess){
            setUploadAction('sucsess')
        }

        
        

    }

    return <>
        <div id={'Create'} className={styles["form-cont"]} ref={elemRef}>
            <div className={styles["heading"]}>Create Service</div>
            <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={yup_validation2}>{(f) =>{console.log();return <>
            <form className={styles["form"]} onSubmit={f.handleSubmit} autoComplete="off">

                <div className={styles['page-section']}>
                    <Text name="url" label="name (https://domain/serivices/'name')" />
                    <CheckBox name="enabled" label="enabled (if not enabled service will not appear on website)" />
                    <CheckBox name="booking" label="show in booking form (selectable in booking form services if the service is enabled)" />
                </div>

                <div className={styles["sub-heading"]}>Services Data</div>

                <div className={styles["sub-sub-heading"]}>Service Tile</div>
                <div className={styles['page-section']}>
                    <Text name="services.tile.order" label="order (where the service is placed on services grid)" />
                    <Text name="services.tile.name" label="name" />
                    <TextArea name="services.tile.desc" label="description" />
                    <FImage name="services.tile.img" label="background image" styleIn={image_styles['service-tile']}/>
                    
                </div>

                <div className={styles["sub-heading"]}>Service Page Data</div>

                <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
                <div className={styles['page-section']}>
                    <Text name="service.intro.name" label="name" />
                    <TextArea name="service.intro.desc" label="description" />
                    <FImage name="service.intro.img" label="background image" styleIn={image_styles['fullscreen']}/>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
                <div className={styles['page-section']}>
                    <div className={""}>Statements (part 1)</div>
                    <Text name="service.summary.s1" label="statement1" />
                    <Text name="service.summary.s2" label="statement2" />
                    <Text name="service.summary.s3" label="statement3" />
                    <FImage name="service.summary.img1" label="statement image (image 1)" styleIn={image_styles['summary-1']}/>
                    <Space />
                    <div className={""}>What (part 2)</div>
                    <TextArea name="service.summary.what" label="text" />
                    <FImage name="service.summary.img2" label="image (image 2)" styleIn={image_styles['summary-2']}/>
                    <Space />
                    <div className={""}>Why (part 3)</div>
                    <TextArea name="service.summary.why" label="text" />
                    <FImage name="service.summary.img3" label="image (image 3)" styleIn={image_styles['summary-3']}/>

                </div>

                <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
                <div className={styles['page-section']}>
                    <TextArea name="service.process.intro" label="intro" />
                    <List name={"service.process.steps"} item_template={step} item_label={"Step"}>
                        {(i, list_name) => <div>
                            <Text name={`${list_name}.${i}.name`} label={`title`} key={i}/>
                            <TextArea name={`${list_name}.${i}.desc`} label={`description`} key={i}/>
                            <FImage name={`${list_name}.${i}.img`} label={`image`} styleIn={image_styles['step']} key={i}/>
                        </div> }
                    </List>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 4: Info/Faq</div>
                <div className={styles['page-section']}>
                    <TextArea name="service.faq.intro" label="intro" />
                    <List name={"service.faq.items"} item_template={question} item_label={"Question"}>
                        {(i, list_name) => <div>
                            <Text name={`${list_name}.${i}.question`} i={i} label={`question`} key={i}/>
                            <TextArea name={`${list_name}.${i}.answer`} i={i} label={`answer`} key={i}/>
                        </div>}
                    </List>
                </div>

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>Create Service</button>   
                </div>

                {f.values['isEditorOpen'] && <ImageEditor />}
                <UploadDisplay 
                    trigger={beginUpload} 
                    action={uploadAction}
                    files={uploadImages}
                    progress={uploadImagesProgress} 
                    actions={uploadActions} 
                    errors={uploadImagesErrors}
                    dataErrorMessages={uploadDataErrors}
                    dataErrorTypes={uploadDataErrorTypes}
                    dataProgress={uploadDataProgress}
                />

            </form>
            </>}}</Formik>

            
        </div>
    </>
}

Create = memo(Create)
Create.defaultProps = {
    
}

function Text({label, ...props}){
    //get data
    const [field, meta] = useField(props)
    const { submitCount } = useFormikContext()

    //determine errors
    let isErr
    if(submitCount){ isErr = meta.error }
    else{ isErr = meta.error==='required' ? false:meta.error && (meta.touched || field.value || field.value===0) }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={props.id || props.name}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${meta.error}`}</pre>:null}
        </label>
        <input className={input_css} type="text" {...field} {...props}/>    
    </div>
}

function TextArea({label, ...props}){
    //get data
    const [field, meta] = useField(props)
    const { submitCount } = useFormikContext()

    //determine errors
    let isErr
    if(submitCount){ isErr = meta.error }
    else{ isErr = meta.error==='required' ? false:meta.error && (meta.touched || field.value || field.value===0) }
    const input_css = classNames(styles["textarea-big"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={props.id || props.name}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${meta.error}`}</pre>:null}
        </label>
        <textarea className={input_css} type="text" {...field} {...props}/>    
    </div>
}

function CheckBox({label, ...props}){
    const [field, meta] = useField(props)
    return <div className={styles["section-checkbox"]}>
        <input className={styles["checkbox"]} type="checkbox" {...field} {...props} checked={field.value}/>  
        <label className={styles["label"]} htmlFor={props.id || props.name}>
            <p>{`${label}`}</p>
        </label>
    </div>
}

function List({name, children, item_template, item_label, ...props}){
    const { values, setFieldValue, submitCount, setFieldTouched} = useFormikContext()
    const [field, meta] = useField(name) //list field

    //define array functions
    const editStep = async (i, item) =>{
        await setFieldTouched(name, true)
        const newSteps = await getIn(values, name)
        if(i=='push'){ newSteps.push(item) }
        else{ item ? newSteps.splice(i, 0, item):newSteps.splice(i, 1) }
        setFieldValue(name, newSteps)
    }
    const ins = (i) =>{editStep(i+1, item_template)}
    const del = (i) =>{editStep(i)}
    const push = () =>{editStep('push', item_template)}

    //determine errors
    let isErr
    const error = typeof meta.error === 'string' ? meta.error:''
    if(submitCount){ isErr = error }
    else{ isErr = error==='required' ? false:error && (meta.touched) }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    return <>
        <label className={styles["label"]} htmlFor={props.id || name}>
            <p>{`${item_label}s`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${meta.error}`}</pre>:null}
        </label>
        {getIn(values, name).map((unneed, i) =>{
            return <>
                <div className={styles['elem-topbar']}>
                    {`${item_label} ${i+1}.`} 
                    <div>
                        <button type="button" className={styles["elem-button-add"]} onClick={() =>{ins(i)}}>Add</button>
                        <button type="button" className={styles["elem-button-del"]} onClick={() =>{del(i)}}>Delete</button>
                    </div>
                </div>
                {children(i, name)}
                <Space />
            </>
        })}
        <button type="button" className={styles["list-add"]} onClick={() => {push()}}>{`+ Add ${item_label}`}</button> 
    </>
 
}

function FImage({name, label, styleIn, ...props}){
    const mb = 1000*1000
    const MAX_FILE_SIZE = props.max_size || 10*mb
    const SUPPORTED_FILE_EXTENSIONS = props.sf || ['.jpg', '.jpeg', '.png', '.gif']
    const { values, setFieldValue, submitCount, setFieldTouched } = useFormikContext()
    const [file, setFile] = useState(null)
    const [dropzoneErr, setDropzoneErr] = useState(false)
    const [field, meta, helpers] = useField(`${name}`)
    const [crop_field, crop_meta, crop_helpers] = useField(`${name}.cropped`)
    // const [name_Field, name_meta, name_helpers] = useField(`${name}.url`)
    const cropped_file = crop_field.value

    //on every drop get called with the files that were just added (not all the files in the dropzone), valid = passed validation of react-dropzone (not yup yet)
    const onDrop = useCallback(async (valid, invalid) => {
        await setFieldTouched(name, true)
        await setDropzoneErr(false)
        if(valid.length){
            setFile(valid[0])
            setFieldValue(`${name}.original`, valid[0])
            setFieldValue(`${name}.cropped`, valid[0])
            setFieldValue(`${name}.url`, null)
        }
        else{`file must be less than ${MAX_FILE_SIZE/mb}mb`
            const code = invalid[0].errors[0].code
            if(code==='file-invalid-type'){setDropzoneErr(`file must be a ${SUPPORTED_FILE_EXTENSIONS}`)}
            if(code==='file-too-large'){setDropzoneErr(`file must be less than ${MAX_FILE_SIZE/mb}mb`)}
            if(cropped_file){setTimeout(()=>{setDropzoneErr(false)}, 4000)}
        }
    }, [cropped_file])

    const {getRootProps, getInputProps} = useDropzone({
        onDrop, 
        multiple:false, 
        accept: {'image/*': SUPPORTED_FILE_EXTENSIONS},
        maxSize: MAX_FILE_SIZE,
        minSize: 10
    })

    //setup image editor for crop
    const crop = async () =>{
        await setFieldValue('editorFileName', name)
        await setFieldValue('editorPreviewStyle', styleIn)
        setFieldValue('isEditorOpen', true)
    }

    //determine errors
    let isErr
    let error = typeof crop_meta.error === 'string' ? crop_meta.error:''
    error = dropzoneErr && !cropped_file ? dropzoneErr:error
    if(submitCount){ isErr = error }
    else{ isErr = error==='required' ? false : error }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    return <>
        <label className={styles["label"]} htmlFor={props.id || name}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${error}`}</pre>:null}
        </label>
        <div className={styles['image-cont']}>
            {cropped_file ? <>
                    <FileImage file={cropped_file} styleIn={styleIn}/>
                    <div className={styles['image-controls-cont']}>
                        <div type="button"onClick={crop}><p className={styles["elem-button-add"]}>Crop</p></div>
                        <div {...getRootProps()} >
                            <input {...getInputProps()}/>
                            <p className={styles["elem-button-del"]}><u>Drag file here</u> or <u>Click</u> to replace</p>
                        </div>
                    </div>
                </>
            :        
                <div {...getRootProps()} className={styles['drop-zone-cont']}>
                    <input {...getInputProps()} className={styles['drop-zone-input']}/>
                    <div className={styles['drop-text']}><p><u>Drag file here</u> or <u>Click</u> to select</p></div> 
                </div>
            }
        </div>
        <div className={styles["dropzone-error-cont"]}>
            {dropzoneErr && cropped_file && <p className={styles["dropzone-error"]}>{dropzoneErr}</p>}
        </div>
        <Text name={`${name}.alt`} label={`text if image will not load (alt)`} />
    </>

}

function Space({}){
    return <div className={styles["space"]}></div>
}

function ImageEditor({}){
    const { values, setFieldValue } = useFormikContext()

    //disable body scroll on editor open (reset when leave this page)
    useToggleScroll(values['isEditorOpen'])

    const [saveCnt, saveCropped] = useState(0)

    const name = values['editorFileName']
    const file = getIn(values, `${name}.original`)

    const setCroped = async (file) => {
        setFieldValue(`${name}.cropped`, file)
        setFieldValue(`${name}.url`, null)
        setFieldValue('isEditorOpen', false)
    }


    return <>
        <div className={styles['crop-modal']}>
            <CropImage file={file} styleIn={values['editorPreviewStyle']} saveCroppedFile={setCroped} save={saveCnt}/>
            <div className={styles['image-editor-controls']}>
                <button type="button" className={styles["elem-button-add"]} onClick={()=>{saveCropped(cur => cur+1)}}>Save</button>
                <button type="button" className={styles["elem-button-del"]} onClick={()=>{setFieldValue('isEditorOpen', false)}}>Close</button>
            </div>
            
        </div>  
    </>

}

function UploadDisplay({trigger, action, files, progress, actions, errors, dataErrorMessages, dataErrorTypes, dataProgress}){
    const [open, setOpen] = useState(false)
    useEffect(() =>{
        trigger ? setOpen(true):setOpen(false)
    }, [trigger])
    useToggleScroll(open)

    if (open){
        return <>
            <div className={styles['crop-modal']}>

                {action==='images' && <div className={styles['upload-images']}>
                    <UploadImagesDisplay 
                        files={files} 
                        progress={progress} 
                        actions={actions} 
                        errors={errors} 
                        setOpen={setOpen}
                    />
                </div>}

                {action==='db' && <div className={styles['upload-db']}>
                    <UploadDataDisplay 
                        messages={dataErrorMessages} 
                        types={dataErrorTypes} 
                        progress={dataProgress} 
                        setOpen={setOpen}
                    />
                </div>}

                {action==='sucsess' && <div className={styles['upload-complete']}>
                    <UploadSucsessDisplay />
                </div>}

            </div>
        </>
    }
    else{
        return null
    }

}

function UploadImagesDisplay({files, progress, actions, errors, setOpen}){
    let error = false
    for(const err of errors){error = err ? true:false}
    return <>
        <div className={styles['heading']}>{!error ? 'Uploading Images':'Error Uploading Images'}</div>
        {error && <div className={styles['sub-heading']}>{`check server status and configuration`}</div>}
        {error && <button type="button" className={styles["upload-close"]} onClick={()=>{setOpen(false)}}>x</button>}
        <div className={styles['upload-images-display']}>
            {files.map((file, i) =>{
                return <UploadImageDisplay file={file} progress={progress[i]} action={actions[i]} error={errors[i]} key={i} />     
            })}
        </div>
    </>
}

const UploadImages = () => {

}

const UploadImage = ({image, action}) => {
    console.log('rendering image', image)
    const [progress, setProgress] = useState([0, 0])
    const {data, isLoading, isError, isFetching, status} = useQuery(['image'], () => upload(image, setProgress), {
        enabled: action === 'images',
    })
    console.log('status', status)
    if (isError){return <>WRONG</>}
    if (isLoading || isFetching){
        if(progress[0] === progress[1]){return <>OPTIMIZING</>}
        return <>LOADING: {progress[0]}/{progress[1]}</>
    }
    console.log('DATA', data)
    return <>OWO</>
}

const UploadData = () => {

}

const UploadComplete = () => {
    
}

function UploadImageDisplay({file, progress, action, error}){
    return <div>
        <ContainFileImage file={file}/>
        {error ? 
            <div className={styles['upload-image-error']}>{`${error}`}</div>
        :
            progress && progress.length && <ProgressBar progress={progress} action={action}/>
        }
        
    </div>
}

function ProgressBar({progress, action}){
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

    return <div className={styles['upload-image-progress']}>

        {action==='uploading' && <div className={styles['progress-uploading']}>
            <Bar progress={Math.floor((loaded*100)/total)} />
            {total!=loaded ? 
                `${loaded}/${total} ${unit}`
            :
            <div className={styles['upload-image-optimizing']}><div className={styles['upload-image-optimizing-text']}>{`Optimizing`}</div><Spinner h={20}/></div>
            }
        </div>}
        
        {action==='uploaded' && <div className={styles['progress-uploaded']}>
            <div className={styles['upload-image-optimizing']}><div className={styles['upload-image-optimizing-text']}>{`Uploaded`}</div></div>
        </div>}
    </div>
}

function ProgressBar2({progress}){
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

    return <div className={styles['upload-image-progress']}>

        <div className={styles['progress-uploading']}>
            <Bar progress={Math.floor((loaded*100)/total)} />
            <div>{`${loaded}/${total} ${unit}`}</div>
        </div>
        
    </div>
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

function UploadDataDisplay({types, messages, setOpen, progress}){
    console.log('REEEEEEEEEE', types, messages)
    return <>
        <div className={styles['heading']}>{!messages.length ? 'Uploading Data to Server':'Error Uploading Data to Server'}</div>
        {types.validation ? <div className={styles['sub-heading']}>{`change form data`}</div>:null}
        {types.server ? <div className={styles['sub-heading']}>{`check server status and configuration`}</div>:null}
        {messages.length ? <div className={styles['upload-data-errors']}>{messages.map((message, i) => <span className={styles['upload-data-error']} key={i}>{`${message}`}</span>)}</div>:null}
        {messages.length ? <button type="button" className={styles["upload-close"]} onClick={()=>{setOpen(false)}}>x</button>:null}
        {!messages.length ? <div className={styles['upload-data-inprogress']}><div className={styles['upload-data-inprogress-text']}>{`In Progress`}</div><Spinner h={60}/></div>:null}
        {!messages.length ? <ProgressBar2 progress={progress} />:null}
    </>

}

function UploadSucsessDisplay({}){
    const { values, setFieldValue, submitCount, setFieldTouched } = useFormikContext()
    const router = useRouter()
    const forceReload = () =>{
        router.reload()
    }

    return <>
        <div className={styles['heading']} style={{"color":'#39C16C'}}>Upload Sucsess</div>
        <div className={styles['sucsess-links']}>
            <div className={styles["sucsess-section"]}>
                <Link href={'http://localhost:3000/admin'}>
                    <a className={styles["sucsess-link"]}>Admin Home</a> 
                </Link>   
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={`http://localhost:3000/services/${values.url}`}>
                    <a className={styles["sucsess-link"]}>View {`${values.url}`}</a> 
                </Link>  
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={''}>
                    <a className={styles["sucsess-link"]}>Edit {`${values.url}`}</a> 
                </Link>     
            </div>

            <div className={styles["sucsess-section"]}>
                <Link href={'http://localhost:3000/admin/services/create'}>
                    <a className={styles["sucsess-link"]} onClick={forceReload}>Create New Service</a> 
                </Link>     
            </div>
        </div>
    </>
}

export default Create