import {memo, useRef, useState} from 'react'
import styles from './create.module.sass'
import {useField, useFormik, Formik} from 'formik'
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
        "url2": Yup.string().max(15,'max len 15 chars').required("required"),
        "tile-desc": Yup.string().max(15,'max len 15 chars').required("required"),
        "process-steps": Yup.array(Yup.object({
            "step-name": Yup.string().max(15,'max len 15 chars').required("required"),           
            "step-desc": Yup.string().max(15,'max len 15 chars').required("required"),  
            "step-img": Yup.string().max(15,'max len 15 chars').required("required"),  
            "step-img-alt": Yup.string().max(15,'max len 15 chars').required("required"),  
        })),
        "faq-items": Yup.array().of(
          Yup.object({
            'faq-question': Yup.string().max(15,'max len 15 chars').required("required"),  
            'faq-answer': Yup.string().max(15,'max len 15 chars').required("required"),  
          })
        )
        
    })

    const sendToAPI = values => {
        //do form validation
        //send to api for update/storage
        // setSteps(steps+1)
        console.log('submmiting', values)
    }

    return <>
        <div id={'Create'} className={styles["form-cont"]}>
            <div className={styles["heading"]}>Create Service</div>
            <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={yup_validation}>{(f) =>{
                return <form className={styles["form"]} onSubmit={f.handleSubmit} autoComplete="off">
                <div className={styles['page-section']}>
                    <TextIn2 state={f} name={"url2"} label={`Testor`} />
                    <TextIn state={f} mid="url" label="name (https://domain/serivices/'name')" />
                    <CheckBox state={f} mid="disable" label="disabled (stored in database but will not appear on website)" />
                    <CheckBox state={f} mid="booking" label="show in booking form (selectable in booking form services)" />
                </div>

                <div className={styles["sub-heading"]}>Service Tile Data</div>

                <div className={styles['page-section']}>
                    <TextIn state={f} mid="tile-order" label="order (where the service is placed on services grid)" />
                    <TextIn state={f} mid="tile-name" label="name" />
                    <TextAr state={f} mid="tile-desc" label="description" />
                    <TextIn state={f} mid="tile-img" label="background image" />
                    <TextIn state={f} mid="tile-img-alt" label="text if image fails to load" />
                </div>

                <div className={styles["sub-heading"]}>Service Page Data</div>

                <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
                <div className={styles['page-section']}>
                    <TextIn state={f} mid="intro-name" label="name" />
                    <TextAr state={f} mid="intro-desc" label="description" />
                    <TextIn state={f} mid="intro-img" label="background image" />
                    <TextIn state={f} mid="intro-img-alt" label="text if image fails to load" />
                </div>

                <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
                <div className={styles['page-section']}>
                    <div className={""}>Statements (part 1)</div>
                    <TextIn state={f} mid="summary-s1" label="statement1" />
                    <TextIn state={f} mid="summary-s2" label="statement2" />
                    <TextIn state={f} mid="summary-s3" label="statement3" />
                    <TextIn state={f} mid="summary-img1" label="statement image (image 1)" />
                    <TextIn state={f} mid="summary-img1-alt" label={`text if image will not load (alt)`} />
                    <Space />
                    <div className={""}>What (part 2)</div>
                    <TextIn state={f} mid="summary-img2" label="image (image 2)" />
                    <TextIn state={f} mid="summary-img2-alt" label={`text if image will not load (alt)`} />
                    <TextAr state={f} mid="summary-what" label="text" />
                    <Space />
                    <div className={""}>Why (part 3)</div>
                    <TextIn state={f} mid="summary-img3" label="image (image 2)" />
                    <TextIn state={f} mid="summary-img3-alt" label={`text if image will not load (alt)`} />
                    <TextAr state={f} mid="summary-why" label="text" />
                </div>

                <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
                <div className={styles['page-section']}>
                    <TextAr state={f} mid="process-intro" label="intro text" />
                    <DynamicInputList f={f} conatinerName={"process-steps"} item_template={step} item_name={"Step"}>
                        {(i) =>{return <div>
                            <TextIn state={f} path={["process-steps", i, 'step-name']} i={i} label={`step ${i+1} title`} key={i}/>
                            <TextIn state={f} path={["process-steps", i, 'step-desc']} i={i} label={`step ${i+1} description`} key={i}/>
                            <TextIn state={f} path={["process-steps", i, 'step-img']} i={i} label={`step ${i+1} image`} key={i}/>
                            <TextIn state={f} path={["process-steps", i, 'step-img-alt']} i={i} label={`text if image will not load (alt)`} key={i}/>
                        </div>}}
                    </DynamicInputList>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 4: Info/Faq</div>
                <div className={styles['page-section']}>
                    <TextAr state={f} mid="faq-intro" label="intro text" />
                    <DynamicInputList f={f} conatinerName={"faq-items"} item_template={question} item_name={"Question"}>
                        {(i) =>{return <div>
                            <TextIn state={f} path={["faq-items", i, 'faq-question']} i={i} label={`question`} key={i}/>
                            <TextAr state={f} path={["faq-items", i, 'faq-answer']} i={i} label={`answer`} key={i}/>
                        </div>}}
                    </DynamicInputList>
                </div>

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>.Submit.</button>   
                </div>


            </form>
            }}
            

            </Formik>
            
        </div>

    </>
}

Create = memo(Create)
Create.defaultProps = {
    
}

function DynamicInputList({f, conatinerName, children, item_template, item_name}){
    const editStep = (i, item) =>{
        const newSteps = f.values[conatinerName]
        item ? newSteps.splice(i, 0, item):newSteps.splice(i, 1)
        f.setFieldValue(conatinerName, newSteps)
    }
    const ins = (i) =>{editStep(i+1, item_template)}
    const del = (i) =>{editStep(i)}
    return <>
        {f.values[conatinerName].map((unneed, i) =>{
            return <>
                <Space />
                <div className={styles['elem-topbar']}>
                    {`${item_name} ${i+1}.`} 
                    <div>
                        <button type="button" className={styles["elem-button-add"]} onClick={() =>{ins(i)}}>Add</button>
                        <button type="button" className={styles["elem-button-del"]} onClick={() =>{del(i)}}>Delete</button>
                    </div>
                </div>
                {children(i)}
            </>
        })}
    <button type="button" className={styles["list-add"]} onClick={() => {ins(f.values[conatinerName].length)}}>{`+ Add ${item_name}`}</button> 
    </>
 
}
//works if the id is the path (i.e 'process-steps.0.step-name') and the value is the object (i.e) f.values['process-steps'][0]['step-name']
function TextIn2({label, ...props}){
    const [field, meta] = useField(props)

    const val = field.value
    const errs = meta.error
    const touched = meta.touched
    //determine error messages
    const isSubmited = props.state.submitCount
    let isErr
    if(isSubmited){ isErr = errs}
    else{ isErr = errs==='required' ? false:errs && (touched || val || val===0) }
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})

    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={props.id || props.name}>
            <p>{`${label}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${errs}`}</pre>:null}
        </label>
        <input className={input_css} type="text" {...field} {...props}/>    
    </div>
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
    // if(mid == 'url'){console.log('REEEEEEEEE', isErr, state.vals, state.errs, state.touched, state)}
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


export default Create