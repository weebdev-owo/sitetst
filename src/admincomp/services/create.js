import {memo, useRef, useState} from 'react'
import styles from './create.module.sass'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';


function Create(){


    const step = {
        "step-name": "",           
        "step-desc": "",
        "step-img": "",
        "step-img-alt": "",
    }
    const question = {
        "faq-question": "",           
        "faq-answer": "",
    }

    const updateSteps = () =>{
        const newSteps = f.values["process-steps"]
        newSteps.push(step)
        f.setFieldValue('process-steps', newSteps)
    }

    const updateFaqs = () =>{
        const newItems = f.values["faq-items"]
        newItems.push(question)
        f.setFieldValue('faq-items', newItems)
    }


    const initialValues = {
        "url": "",
        "disable": false,
        "booking":true,

        "tile-order":"",
        "tile-name":"",
        "tile-desc":"",
        "tile-img":"",

        "tile-img-alt":"",
        "intro-name":"",
        "intro-desc":"",
        "intro-img":"",
        "intro-img-alt":"",

        "summary-s1":"",
        "summary-s2":"",
        "summary-s3":"",
        "summary-img1":"",
        "summary-img1-alt":"",
        "summary-img2":"",
        "summary-img2-alt":"",
        "summary-what":"",
        "summary-img3":"",
        "summary-img3-alt":"",
        "summary-why":"",

        "process-intro":"",
        "process-steps": [],

        "faq-intro":"",
        "faq-items": [],


    }

    const yup_validation = Yup.object({
        "url": Yup.string().max(15,'max len 15 chars').required("required"),
        // "disable": Yup.string().max(15,'max len 15 chars').required("required"),
        "tile-desc": Yup.string().max(15,'max len 15 chars').required("required"),
        "process-steps": Yup.array(Yup.object({
            "step-name": Yup.string().max(15,'max len 15 chars').required("required"),           
            "step-desc": Yup.string().max(15,'max len 15 chars').required("required"),  
            "step-img": Yup.string().max(15,'max len 15 chars').required("required"),  
            "step-img-alt": Yup.string().max(15,'max len 15 chars').required("required"),  
        }))
        
    })

    const sendToAPI = values => {
        //do form validation
        //send to api for update/storage
        // setSteps(steps+1)
        console.log(values)
    }

    const f = useFormik({
        initialValues: initialValues, 
        validationSchema: yup_validation,
        onSubmit: sendToAPI
    })


    console.log(f.values)
    return <>
        <div id={'Book'} className={styles["booking"]}>
            <div className={styles["heading"]}>Create Service</div>

            <form className={styles["form"]} onSubmit={f.handleSubmit}>
                <TextIn state={f} mid="url" label="url" />
                <TextIn state={f} mid="disable" label="disable (saved on database but will not appear on website)" />
                <TextIn state={f} mid="booking" label="show in booking form" />

                <div className={styles["sub-heading"]}>Service Tile Data</div>
                <TextIn state={f} mid="tile-order" label="order" />
                <TextIn state={f} mid="tile-name" label="name" />
                <TextAr state={f} mid="tile-desc" label="description" />
                <TextIn state={f} mid="tile-img" label="background image" />
                <TextIn state={f} mid="tile-img-alt" label="text if image fails to load" />

                <div className={styles["sub-heading"]}>Service Page Data</div>
                <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
                <TextIn state={f} mid="intro-name" label="name" />
                <TextAr state={f} mid="intro-desc" label="description" />
                <TextIn state={f} mid="intro-img" label="background image" />
                <TextIn state={f} mid="intro-img-alt" label="text if image fails to load" />

                <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
                <div className={""}>Statements (part 1)</div>
                <TextIn state={f} mid="summary-s1" label="statement1" />
                <TextIn state={f} mid="summary-s2" label="statement2" />
                <TextIn state={f} mid="summary-s3" label="statement3" />
                <TextIn state={f} mid="summary-img1" label="statement image (image 1)" />
                <TextIn state={f} mid="summary-img1-alt" label="text if image fails to load" />
                <Space />
                <div className={""}>What (part 2)</div>
                <TextIn state={f} mid="summary-img2" label="image (image 2)" />
                <TextIn state={f} mid="summary-img2-alt" label="text if image fails to load" />
                <TextAr state={f} mid="summary-what" label="text" />
                <Space />
                <div className={""}>Why (part 3)</div>
                <TextIn state={f} mid="summary-img3" label="image (image 2)" />
                <TextIn state={f} mid="summary-img3-alt" label="text if image fails to load" />
                <TextAr state={f} mid="summary-why" label="text" />

                <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
                <TextIn state={f} mid="process-intro" label="intro text" />
                {f.values["process-steps"].map((step, i) =>{
                    // return <TextInD state={f} mid="process-steps" i={i} label={`step ${i}`} key={i}/>
                    return <>
                        <Space />
                        <div className={""}>{`Step ${i+1}.`} </div>
                        <TextIn state={f} path={["process-steps", i, 'step-name']} i={i} label={`step ${i+1} title`} key={i}/>
                        <TextIn state={f} path={["process-steps", i, 'step-desc']} i={i} label={`step ${i+1} description`} key={i}/>
                        <TextIn state={f} path={["process-steps", i, 'step-img']} i={i} label={`step ${i+1} image`} key={i}/>
                        <TextIn state={f} path={["process-steps", i, 'step-img-alt']} i={i} label={`step ${i+1} text if image fails to load`} key={i}/>
                    </>
                })}
                <button type="button" className={styles["submit"]} onClick={updateSteps}>add step</button>  

                <div className={styles["sub-sub-heading"]}>Section 4: Info/Faq</div>
                <TextIn state={f} mid="process-intro" label="intro text" />
                {f.values["faq-items"].map((item, i) =>{
                    // return <TextInD state={f} mid="process-steps" i={i} label={`step ${i}`} key={i}/>
                    return <>
                        <Space />
                        <div className={""}>{`Question ${i+1}.`} </div>
                        <TextIn state={f} path={["faq-items", i, 'faq-question']} i={i} label={`question`} key={i}/>
                        <TextAr state={f} path={["faq-items", i, 'faq-answer']} i={i} label={`answer`} key={i}/>
                    </>
                })}
                <button type="button" className={styles["submit"]} onClick={updateFaqs}>add question</button>


                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>.Submit.</button>   
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

    //determine if error messages should be displayed based on data
    const isErr = errs && touched
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

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${errs}`}</pre>:null}
        </label>
        <textarea 
            id={mid}
            className={styles["textarea-smol"]} 
            type="text" 
            value={vals}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
         />    
    </div>
}
function Space({}){
    return <div className={styles["space"]}></div>
}


export default Create