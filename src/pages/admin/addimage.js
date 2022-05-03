import {memo, useRef, useState} from 'react'
import styles from '/src/css/addimage.module.sass'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';


function Create(){

    const SUPPORTED_FORMATS = ['jpg', 'png', 'webp']
    const FILE_SIZE = 200000
    const image = {
        image: Yup.mixed() 
        .test('fileSize', "File Size is too large", value => value.size <= FILE_SIZE) 
        .test('fileType', "Unsupported File Format", value => SUPPORTED_FORMATS.includes(value.type) )
    }

    const addImage = () =>{
        const newSteps = f.values["process-steps"]
        newSteps.push(step)
        f.setFieldValue('process-steps', newSteps)
    }

    const deleteImage = (i) =>{
        const newSteps = f.values["process-steps"]
        newSteps.splice(i, 1)
        f.setFieldValue('process-steps', newSteps)
    }

    const initialValues = {
        "image": "",
    }

    const yup_validation = Yup.object({
        "url": Yup.string().max(15,'max len 15 chars').required("required"),
        "image": Yup.mixed() 
            .test('fileSize', "File Size is too large", value => value.size <= FILE_SIZE) 
            .test('fileType', "Unsupported File Format", value => SUPPORTED_FORMATS.includes(value.type))
        
    })

    const sendToAPI = values => {
        //do form validation
        //send to api for update/storage
        // setSteps(steps+1)
        console.log('submmiting', values)
    }

    const f = useFormik({
        initialValues: initialValues, 
        // validationSchema: yup_validation,
        onSubmit: sendToAPI
    })

    console.log(f.values)
    return <>
        <div id={'Book'} className={styles["booking"]}>
            <div className={styles["heading"]}>Create Service</div>

            <form className={styles["form"]} onSubmit={f.handleSubmit} autoComplete="off">
                {/* <TextIn state={f} mid="url" label="name (https://domain/serivices/'name')" /> */}
                {/* <CheckBox state={f} mid="disable" label="disabled (stored in database but will not appear on website)" /> */}
                <ImageIn state={f} mid="image" label="add image" />



                {/* {f.images.map((item, i) =>{
                    return <>
                        <Space />
                        <div className={styles['elem-topbar']}>
                            {`Question ${i+1}.`} 
                            <div>
                                <button type="button" className={styles["elem-button-add"]} onClick={() =>{insertQuestion(i)}}>add</button>
                                <button type="button" className={styles["elem-button-del"]} onClick={() =>{deleteQuestion(i)}}>delete</button>
                            </div>
                        </div>
                        <TextIn state={f} path={["faq-items", i, 'faq-question']} i={i} label={`question`} key={i}/>
                        <TextAr state={f} path={["faq-items", i, 'faq-answer']} i={i} label={`answer`} key={i}/>
                    </>
                })}
                <button type="button" className={styles["list-add"]} onClick={addQuestion}>+ add question</button> */}

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>.Add Image.</button>   
                </div>

            </form>
        </div>

    </>
}

Create = memo(Create)
Create.defaultProps = {
    
}


//works if the id is the path (i.e 'process-steps.0.step-name') and the value is the object (i.e) f.values['process-steps'][0]['step-name']
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

function TextAr({state, mid, path, label}){

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

    //determine if error messages should be displayed based on data
    const isErr = errs && touched
    const input_css = classNames(styles["textarea-big"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${errs}`}</pre>:null}
        </label>
        <textarea 
            id={mid}
            className={input_css} 
            type="text" 
            value={vals}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
         />    
    </div>
}

function CheckBox({state, mid, path, label}){

    //create missing props from supplied ones
    if(!path){path = [mid]}
    else{if(!mid){mid=path.join('.')}}

    //get data based on the path supplied
    let vals = state.values
    // let errs = state.errors
    // let touched = state.touched
    path.forEach((entry)=>{
        if(vals){vals = vals[entry]}
        // if(errs){errs = errs[entry]}
        // if(touched){touched = touched[entry]}
    })

    //determine if error messages should be displayed based on data
    // const isErr = errs && touched
    // const input_css = classNames(styles["textarea-big"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section-checkbox"]}>
        <input 
            id={mid}
            className={styles["checkbox"]} 
            type="checkbox" 
            value={vals}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
            checked={vals}
         />    
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${label}`}</p>
        </label>

    </div>
}
function Space({}){
    return <div className={styles["space"]}></div>
}

function ImageIn({state, mid, path, label}){

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
    const input_css = classNames(styles["file"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${errs}`}</pre>:null}
        </label>
        <input 
            id={mid}
            className={input_css} 
            type="file" 
            value={vals}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
            accept="image/png, image/jpeg"
        />    
    </div>
}

export default Create