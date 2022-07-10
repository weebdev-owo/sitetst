import React, {memo, useRef, useState, useCallback, useEffect, useReducer, useMemo, useContext} from 'react'
import styles from './cms.module.sass'
import {useField, useFormikContext, getIn} from 'formik'
import  classNames  from 'classnames';
import { useDropzone } from "react-dropzone"
// import 'react-image-crop/dist/ReactCrop.css'
import FileImage from '/src/cms/lib/utils/preview/fileImage'
import 'react-image-crop/dist/ReactCrop.css'
import CropImage from '/src/cms/lib/utils/crop/cropImageForm'
import useToggleScroll from '/src/cms/lib/utils/toggleScroll'
import useErrorScroll from '/src/cms/lib/utils/useErrorScroll'
import { getByPath } from '/src/cms/lib/utils/byPath';

//FORM PRIMITIVES//
function Text({label, ...props}){
    //get data
    const [field, meta] = useField(props)
    const { submitCount } = useFormikContext()

    //determine errors
    let isErr
    if(submitCount){ isErr = meta.error }
    else{ isErr = meta.error==='required' ? false:meta.error && (meta.touched || field.value || field.value===0) }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    //scroll to error on submit
    const elemRef = useErrorScroll(props.name, meta)


    return <div className={styles["section"]} ref={elemRef}>
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

    //scroll to error on submit
    const elemRef = useErrorScroll(props.name, meta)

    return <div className={styles["section"]} ref={elemRef}>
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
    const { values, setFieldValue, submitCount, setFieldTouched, isSubmitting} = useFormikContext()
    const [field, meta] = useField(name) //list field
    
    //define array functions
    const editStep = async (i, item) =>{
        await setFieldTouched(name, true)
        const newSteps = getByPath(values, name)
        if(i=='push'){ newSteps.push(item) }
        else{ item ? newSteps.splice(i, 0, item):newSteps.splice(i, 1) }
        setFieldValue(name, newSteps)
        console.log('ITEMMMMMM', item)
    }
    const ins = (i) =>{editStep(i, JSON.parse(JSON.stringify(item_template)))}
    const del = (i) =>{editStep(i)}
    const push = () =>{editStep('push', JSON.parse(JSON.stringify(item_template)))}

    //determine errors
    let isErr
    const error = typeof meta.error === 'string' ? meta.error:''
    if(submitCount || isSubmitting){ isErr = error }
    else{ isErr = error==='required' ? false:error && (meta.touched) }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    //scroll to error on submit
    const elemRef = useErrorScroll(name, meta)

    return <>
        <label className={styles["section-desc"]} htmlFor={props.id || name} ref={elemRef}>
            <p>{`${item_label}s`}</p>
            {isErr ? <pre className={styles['label-err']}>{` ${meta.error}`}</pre>:null}
        </label>
        <div className={styles['list-cont']}>
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
                    {/* <Space />    */}
                </>
            })}
        </div>
        
        <button type="button" className={styles["list-add"]} onClick={() => {push()}}>{`+ Add ${item_label}`}</button> 
    </>
 
}

function ImageEditor({name, imageStyle, setOpen}){
    const { values, setFieldValue } = useFormikContext()

    //disable body scroll on editor open (reset when leave this page)
    // useToggleScroll(values['isEditorOpen'])

    const [saveTrigger, triggerSave] = useState(0)

    const file = getIn(values, `${name}.original`)

    const saveCroped = async (file) => {
        setFieldValue(`${name}.cropped`, file)
        setFieldValue(`${name}.url`, null)
        setOpen(false)
    }


    return <>
        <div className={styles['crop-modal']}>
            <CropImage file={file} styleIn={imageStyle} saveCroppedFile={saveCroped} save={saveTrigger}/>
            <div className={styles['image-editor-controls']}>
                <button type="button" className={styles["elem-button-add"]} onClick={()=>{triggerSave(cur => cur+1)}}>Save</button>
                <button type="button" className={styles["elem-button-del"]} onClick={()=>{setOpen(false)}}>Close</button>
            </div>
        </div>  
    </>

}

function FormImage({name, label, image_style, ...props}){
    const mb = 1000*1000
    const MAX_FILE_SIZE = props.max_size || 10*mb
    const SUPPORTED_FILE_EXTENSIONS = props.sf || ['.jpg', '.jpeg', '.png', '.gif']
    const { values, setFieldValue, submitCount, setFieldTouched,isSubmitting } = useFormikContext()
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
            if(code==='file-invalid-type'){setDropzoneErr(`file must be of type: ${SUPPORTED_FILE_EXTENSIONS.join(', ')}`)}
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


    //IMAGE EDITOR
    //setup image editor for crop
    const [editorOpen, setEditorOpen] = useState(false)
    useToggleScroll(editorOpen)
    const crop = async () =>{
        setEditorOpen(true)
    }

    //determine errors
    let isErr
    let error = typeof crop_meta.error === 'string' ? crop_meta.error:''
    error = dropzoneErr && !cropped_file ? dropzoneErr:error
    if(submitCount || isSubmitting){ isErr = error }
    else{ isErr = error==='required' ? false : error }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    //scroll to error on submit
    const elemRef = useErrorScroll(name, meta, isErr)

    return <>
        {editorOpen ? <ImageEditor name={name} imageStyle={image_style} setOpen={setEditorOpen} />:null}
        <label className={styles["label"]} htmlFor={props.id || name} ref={elemRef}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${error}`}</pre>:null}
        </label>
        <div className={styles['image-cont']}>
            {cropped_file ? <>
                    <FileImage file={cropped_file} styleIn={image_style}/>
                    <div className={styles['image-controls-cont']}>
                        <div type="button" onClick={crop}><p className={styles["elem-button-add"]}>Crop</p></div>
                        <div {...getRootProps()} >
                            <input {...getInputProps()}/>
                            <p className={styles["elem-button-del"]}><u>Drag file here</u> or <u>Click</u> to replace</p>
                        </div>
                    </div>
                    <div className={styles["dropzone-error-cont"]}>
                        {dropzoneErr && cropped_file && <p className={styles["dropzone-error"]}>{dropzoneErr}</p>}
                    </div>
                    <Text name={`${name}.alt`} label={`image description for SEO (alt)`} />
                </>
            :        
            <>
                <div {...getRootProps()} className={styles['drop-zone-cont']}>
                    <input {...getInputProps()} className={styles['drop-zone-input']}/>
                    <div className={styles['drop-text']}><p><u>Drag file here</u> or <u>Click</u> to select</p></div> 
                </div>
                <div className={styles["dropzone-error-cont"]}>
                    {dropzoneErr && cropped_file && <p className={styles["dropzone-error"]}>{dropzoneErr}</p>}
                </div>
            </>
            }
        </div>


    </>
}

function Space({}){
    return <div className={styles["space"]}></div>
}

export {Text, TextArea, CheckBox, List, FormImage, Space}
