import {memo, useRef, useState, useEffect} from 'react'
import styles from '/src/css/addimage.module.sass'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';
import Img from '/src/lib/img'
import axios from 'axios'


function AddImage(){

    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
    const FILE_SIZE = 127000000

    const initialValues = {
        "filename": "",
        "image": "",

    }

    const yup_validation = Yup.object({
        "image": Yup.mixed() 
            .test('fileSize', "File Size is too large", value => {if(typeof value == 'object') {return value.size < FILE_SIZE} else{return true}}) 
            .test('fileType', "Unsupported File Format", value => {if(typeof value == 'object') {return SUPPORTED_FORMATS.includes(value.type)} else{return true}})
            .required('required'),
        "filename": Yup.string()
            .max(20,'max len 20 chars')
            .matches(/^(?![0-9]*$)[a-zA-Z0-9]+$/, "only letters or numbers allowed")
            .matches(/^[A-Za-z].*/, "file name should not start with special characters")
            .matches(/^[^\\/:\*\?"<>\|]+$/,' forbidden characters \ / : * ? " < > |')
            .matches(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!aux$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/, 'forbidden file name')
            .required("required")
    })

    const sendToAPI = async values => {
        console.log('submit', values.image.size)
        try{
            const res = await axios.post('http://localhost:3000/api/uploadimage', values, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res.data)
        }
        catch (e){
            console.log(e)
        }
    }

    const f = useFormik({
        initialValues: initialValues, 
        validationSchema: yup_validation,
        onSubmit: sendToAPI
    })

    console.log(f.values)

    return <>
        <div id={'Book'} className={styles["booking"]}>
            <div className={styles["heading"]}>Edit Images</div>

            <form className={styles["form"]} onSubmit={f.handleSubmit} autoComplete="off">
                <ImageIn state={f} mid="image" label="Image"/>
                <TextIn state={f} mid={"filename"} label="choose a name for the image"/>
                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>.Add Image.</button>   
                </div>

            </form>
        </div>
    </>
}

AddImage = memo(AddImage)
AddImage.defaultProps = {
    
}

function ImageIn({state, mid, path, label, setimg}){

    //create missing props from supplied ones
    if(!path){path = [mid]}
    else{if(!mid){mid=path.join('.')}}

    //get data based on the path supplied
    let vals = state.values
    let errs = state.errors
    let touched = state.touched
    path.forEach((entry, i)=>{
        if(vals){vals = vals[entry]}
        if(errs){errs = errs[entry]}
        if(touched){touched = touched[entry]}
    })


    //determine if error messages should be displayed based on data
    let isErr
    if(errs==='required'){
        if(state.submitCount){isErr = errs}
        else{isErr = false}
    }
    else{ 
        isErr = errs && touched 
    }
    const input_css = classNames(styles["file"], {[styles["textarea-err"]]: isErr})

    const [preview, setPreview] = useState(null)
    useEffect(() =>{
        if(vals){
            const reader = new FileReader()
            reader.onloadend = () => {setPreview(reader.result)}
            reader.readAsDataURL(vals)
        }
        else{
            setPreview(null)
        }
    }, [vals])

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${errs}`}</pre>:null}
        </label>
        <input 
            id={mid}
            className={input_css} 
            type="file" 
            // value={vals}
            onChange={(event) => {
                state.handleChange(event)
                state.setFieldValue(mid, event.currentTarget.files[0])
            }}
            onBlur={state.handleBlur}
            accept="image/png, image/jpeg"
        />    
        {preview ? <Img src={preview} />:null}
    </div>
}

function TextIn({state, mid, path, label}){

    //create missing props from supplied ones
    if(!path){path = [mid]}
    else{if(!mid){mid=path.join('.')}}

    //get data based on the path supplied
    let vals = state.values
    let errs = state.errors
    let touched = state.touched
    path.forEach((entry)=>{
        if(vals){vals = vals[entry]}
        if(errs){errs = errs[entry]}
        if(touched){touched = touched[entry]}
    })
    let isErr
    //determine if error messages should be displayed based on data
    if(errs==='required'){
        if(state.submitCount){isErr = errs}
        else{isErr = false}
    }
    else{ 
        isErr = errs && touched 
    }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${errs}`}</pre>:null}
        </label>
        <input 
            id={mid}
            className={input_css} 
            type="text" 
            value={vals}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
         />    
    </div>
}

export default AddImage