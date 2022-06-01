import React, {memo, useRef, useState, useCallback, useEffect} from 'react'
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

const initialValues = {
    "url": "ghtf",
    "disable": false,
    "booking":true,

    services: {
        tile: {
            "order":1,
            "name":"gdr",
            "desc":"drg",
            "img": img,
        },
    },

    // service:{
    //     intro: {
    //         "name":"drg",
    //         "desc":"drg",
    //         "img": img,
    //     },
    //     summary: {
    //         "s1":"drg",
    //         "s2":"drg",
    //         "s3":"drg",
    //         "img1": img,
    //         "what":"drg",
    //         "img2": img,
    //         "why":"drg",
    //         "img3": img,
    //     },
    //     process:{
    //         "intro":"drg",
    //         "steps": [{
    //             "name": "drg",           
    //             "desc": "drg",
    //             "img": img,
    //         }],
    //     },
    //     faq: {
    //         "intro":"drg",
    //         "items": [{
    //             "question": "fth",           
    //             "answer": "ftfth",
    //         }],
    //     },
    // },
    

    "isEditorOpen": false,
    "editorFileName": "",
    "editorPreviewStyle": null,

    'isSubmitOpen': false,

}

const initialValues2 = {
    "url": "",
    "disable": false,
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

//setup form validation
const b = 8
const kb = 1000
const mb = 1000*kb
const MAX_FILE_SIZE = 10*mb
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const SUPPORTED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif']
const title = 30
const short = 60
const para = 400

const valid_num = (min, max) => Yup.number()
    .typeError('must be a number')
    .min(min, `must be ${min} or greater`)
    .max(max, `must be ${max} or smaller`)
    .required('required')
const restricted_name = num_chars => Yup.string()
    .max(num_chars,`max length ${num_chars} chars`)
    .matches(/^(?![0-9]*$)[a-zA-Z0-9]+$/, "only letters or numbers allowed")
    .matches(/^[A-Za-z].*/, "file name should not start with special characters")
    .matches(/^[^\\/:\*\?"<>\|]+$/,' forbidden characters \ / : * ? " < > |')
    .matches(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!aux$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/, 'forbidden file name')
    .required("required")
const brief_text = (num_chars) => Yup.string()
    .matches(/^[\.a-zA-Z0-9,!? ]*$/, "only letters, numbers, spaces and punctuation allowed")
    .max(num_chars, `max length ${num_chars} chars`)
    .required("required")
const valid_array = (label, min, max, item) => Yup.array().of(Yup.object(item))
    .min(1, `must have more than ${min} ${label}`)
    .max(50, `can only have up to ${max} ${label}`)
    .required('requred')
const valid_img_file = Yup.mixed() 
    .test('fileSize', `file must be less than ${MAX_FILE_SIZE/mb}mb`, value => value ? value.size<=MAX_FILE_SIZE:true) 
    .test('fileType', `file must be a ${SUPPORTED_FILE_EXTENSIONS}`, value => value ? SUPPORTED_FORMATS.includes(value.type):true)
    .required('required')
const img_data = Yup.object({
    cropped: valid_img_file,
    alt: brief_text(short)
})

const yup_validation = Yup.object({
    "url": restricted_name(20),
    "disable": Yup.boolean(),
    "booking": Yup.boolean(),
    services: Yup.object({
        tile: Yup.object({
            "order": valid_num(0, 100),
            "name": brief_text(title),
            "desc": brief_text(short), 
            "img": img_data,
        }),
    }),
    service: Yup.object({
        intro: Yup.object({
            "name": brief_text(title),
            "desc": brief_text(para), 
            "img": img_data,
        }),
        summary: Yup.object({
            "s1": brief_text(title),
            "s2": brief_text(title),
            "s3": brief_text(title),
            "img1": img_data,
            "what": brief_text(para), 
            "img2": img_data,
            "why": brief_text(para), 
            "img3": img_data,
        }),
        process: Yup.object({
            "intro": brief_text(para), 
            "steps": valid_array('steps', 0, 50, {
                "name": brief_text(short),           
                "desc": brief_text(para),  
                "img": img_data,  
            }),
        }),
        faq: Yup.object({
            "intro": brief_text(para), 
            "items": valid_array('questions', 0, 50, {
                'question': brief_text(short),  
                'answer': brief_text(para),  
            }),
        }),
    })
    
   
})

const yup_validation2 = Yup.object()

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

// const paths = []
const upload_images = []
const imgs = []
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


function Create(){
    const [beginUpload, setBeginUpload] = useState(0)
    const [images_data, setImagesData] = useState([])
    //Change body background and scroll when ref onscreen
    const elemRef = useRef(null)
    SetBgInv(elemRef)
    const upload_image = useCallback(async (img, i) => {
        console.log('uploading', i)
        //handle uploading and uploading display
        try{
            console.log('uploaddd strt', i)
            const res = await axios.post(
                'http://localhost:3000/api/uploadSingleImage', 
                {image: img['cropped']}, 
                {headers: 
                    {'Content-Type': 'multipart/form-data'},
                    onUploadProgress: async (e) => {
                        console.log('HMMMMMMM', images_data)
                        const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength !== null) {
                            const progressData = [e.loaded, totalLength];
                            console.log(`progress: `,progressData)
                            await setImagesData((images_data) =>{
                                const data = [...images_data]
                                data[i][1] = progressData
                                data[i].push(cnt)
                                cnt += 1
                                console.log('insidQQQQQQQQQ', data)
                                return data
                            })
                        }
                    }
                }
            )
            console.log('uploaded', i, res.data)
            img['url'] =  res.data.url
            return true
        }
        catch (e){
            console.log(`error uploading ${i}`, e)
        }
    })
    
    const sendToAPI = async (values) => {
        console.log('submmiting', values)
        //UPLOAD IMAGES
        //scan values for the key "img*"
        await setBeginUpload(beginUpload+1)
        await setImagesData([])
        console.log('reeeeee', images_data)
        let paths = get_imgs(values, [], [])
        const upload_paths = paths.map((path) =>{
            if (!getImg(values, path)['url']){return path}
        })
        console.log('upload paths', upload_paths)
        const new_images_data = upload_paths.map((path) =>{
            return [getImg(values, path)['cropped'], 0]
        })
        console.log('NEWWW DATA', new_images_data)
        await setImagesData(new_images_data)
        console.log('NEWWW DATA', images_data)

        // send images to api
        try{
            const uploaded_images = await Promise.all(upload_paths.map(async (path, i) => upload_image(getImg(values, path), i)))
            for (const res of uploaded_images){if(!res){throw 'failed to upload'}}
            console.log('Upload Sucsess', uploaded_images)
            const payload = JSON.parse(JSON.stringify(values))
            for (const path of paths){
                const img = getImg(values, path)
                setImg(payload, path, {
                    url: img['url'],
                    alt: img['alt']
                })
            }
            console.log('modified payload', payload)
            console.log('hhmhm', images_data)
        }
        catch (e){
            console.log('Error uploading images', e)
        }
    }

    const sendToAPI2 = async (values) => {
        console.log('submmiting', values)
        //UPLOAD IMAGES
        //scan values for the key "img*"

        //send to api for update/storage
        // const paths = []
        const img_data = getImg(values, [])
        console.log('ree', img_data)
        const imgs = []

        paths = []
        get_imgs(values, [])
        console.log(paths)
        //concurrent image upload
        
        const uploaded_images = []
        // const uploaded_images = await Promise.all(paths.map(async (path, i) => {
        await Promise.all(paths.forEach(async (path, i) => {

            const img_data = getImg(values, path)
            console.log('uploading', i, img_data['url'])
            if (!img_data['url']){
                try{
                    console.log('upload strt', i )
                    const res = await axios.post('http://localhost:3000/api/uploadSingleImage', {image: img_data['cropped']}, {headers: {'Content-Type': 'multipart/form-data'}})
                    console.log('uploaded', i, res.data)
                    uploaded_images.push(res)
                    console.log('nnnn')
                }
                catch (e){
                    console.log(e)
                }
            }
        }))
        console.log('REEEEEEE', uploaded_images)
    }

    return <>
        <div id={'Create'} className={styles["form-cont"]} ref={elemRef}>
            <div className={styles["heading"]}>Create Service</div>
            <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={yup_validation2}>{(f) =>{console.log();return <>
            <form className={styles["form"]} onSubmit={f.handleSubmit} autoComplete="off">

                <div className={styles['page-section']}>
                    <Text name="url" label="name (https://domain/serivices/'name')" />
                    <CheckBox name="disable" label="disabled (stored in database but will not appear on website)" />
                    <CheckBox name="booking" label="show in booking form (selectable in booking form services)" />
                </div>

                <div className={styles["sub-heading"]}>Services Page Data</div>

                <div className={styles["sub-sub-heading"]}>Service Tile</div>
                <div className={styles['page-section']}>
                    <Text name="services.tile.order" label="order (where the service is placed on services grid)" />
                    <Text name="services.tile.name" label="name" />
                    <TextArea name="services.tile.desc" label="description" />
                    <FImage name="services.tile.img" label="background image" styleIn={image_styles['service-tile']}/>
                    
                </div>
{/* 
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
                </div> */}

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>Create Service</button>   
                </div>

                {f.values['isEditorOpen'] && <ImageEditor />}
                {/* <UploadDisplay trigger={beginUpload}/> */}

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
                <Space />
                <div className={styles['elem-topbar']}>
                    {`${item_label} ${i+1}.`} 
                    <div>
                        <button type="button" className={styles["elem-button-add"]} onClick={() =>{ins(i)}}>Add</button>
                        <button type="button" className={styles["elem-button-del"]} onClick={() =>{del(i)}}>Delete</button>
                    </div>
                </div>
                {children(i, name)}
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

function UploadDisplay({trigger, action, images_data}){
    const [open, setOpen] = useState(false)
    useEffect(() =>{
        console.log('callehjhy', trigger)
        trigger ? setOpen(true):setOpen(false)
    }, [trigger])
    useToggleScroll(open)

    if (open){
        return <>
            <div className={styles['crop-modal']}>
                <button type="button" className={styles["elem-button-del"]} onClick={()=>{setOpen(false)}}>Close</button>
                
                {action==='error' && <div className={styles['upload-display-error']}>
                    
                </div>}

                {action==='images' && <div className={styles['upload-images']}>
                    <UploadImagesDisplay images={images_data} />
                </div>}

                {action==='db' && <div className={styles['upload-db']}>
                    
                </div>}

                {action==='complete' && <div className={styles['upload-complete']}>
                    
                </div>}

            </div>
        </>
    }
    else{
        return null
    }

}

function UploadImagesDisplay({data}){
    const { values, setFieldValue } = useFormikContext()

    return <>
        <div className={styles['upload-images-display']}></div>
        {data.map(([file, progress], i) =>{
            return <UploadImageDisplay file={file} progress={progress} key={i} />     
        })}
    </>
}

function UploadImageDisplay({file, progress}){
    return <>
        <ContainFileImage file={file}/>
        <ProgressBar status={0} progress={progress}/>
    </>
}

function ProgressBar({progress}){

    {action==='uploading' && <div className={styles['progress-uploading']}>
        {'sending file to server'}
    </div>}

    {action==='processing' && <div className={styles['progress-processing']}>
        {'processing on cloudinary'}
    </div>}
    
    {action==='uploaded' && <div className={styles['progress-uploaded']}>
        {'uploaded'}
    </div>}

}

export default Create