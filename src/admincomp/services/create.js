import {memo, useRef, useState} from 'react'
import styles from './create.module.sass'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import  classNames  from 'classnames';


function Create(){
    const [update, setUpdate] = useState(0)
    const step = {
        "step-name": "",           
        "step-title": "",
        "step-img": "",
        "step-img-alt": "",
    }
    const question = {

    }
    // f.values["process-steps"].push(step)
    // f.values["process-steps"].remove(index)
    const updateSteps = () =>{
        // f.values["process-steps"].push(step); setUpdate(update+1)
        const newSteps = f.values["process-steps"]
        newSteps.push(step)
        f.setFieldValue('process-steps', newSteps)
    }


    const initialValues = {
        "url": "",
        "disable": false,
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
        "process-steps": [step]

    }

    const yup_validation = Yup.object({
        "url": Yup.string().max(15,'max len 15 chars').required("required"),
        // "disable": Yup.string().max(15,'max len 15 chars').required("required"),
        // "tile-name": Yup.string().max(15,'max len 15 chars').required("required"),
        "process-steps": Yup.array(Yup.object({
            "step-name": Yup.string().max(15,'max len 15 chars').required("required"),           
            "step-title": Yup.string().max(15,'max len 15 chars').required("required"),  
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

    return <>
        <div id={'Book'} className={styles["booking"]}>
            <div className={styles["heading"]}>Create Service</div>

            <form className={styles["form"]} onSubmit={f.handleSubmit}>
                <TextIn state={f} mid="url" title="title" />
                <TextIn state={f} mid="disable" title="disable" />

                <div className={styles["sub-heading"]}>Service Tile Data</div>
                <TextIn state={f} mid="tile-order" title="order" />
                <TextIn state={f} mid="tile-name" title="name" />
                <TextAr state={f} mid="tile-desc" title="description" />
                <TextIn state={f} mid="tile-img" title="background image" />
                <TextIn state={f} mid="tile-img-alt" title="text if image fails to load" />

                <div className={styles["sub-heading"]}>Service Page Data</div>
                <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
                <TextIn state={f} mid="intro-name" title="name" />
                <TextAr state={f} mid="intro-desc" title="description" />
                <TextIn state={f} mid="intro-img" title="background image" />
                <TextIn state={f} mid="intro-img-alt" title="text if image fails to load" />

                <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
                <div className={""}>Statements (part 1)</div>
                <TextIn state={f} mid="summary-s1" title="statement1" />
                <TextIn state={f} mid="summary-s2" title="statement2" />
                <TextIn state={f} mid="summary-s3" title="statement3" />
                <TextIn state={f} mid="summary-img1" title="statement image (image 1)" />
                <TextIn state={f} mid="summary-img1-alt" title="text if image fails to load" />
                <Space />
                <div className={""}>What (part 2)</div>
                <TextIn state={f} mid="summary-img2" title="image (image 2)" />
                <TextIn state={f} mid="summary-img2-alt" title="text if image fails to load" />
                <TextAr state={f} mid="summary-what" title="text" />
                <Space />
                <div className={""}>Why (part 3)</div>
                <TextIn state={f} mid="summary-img3" title="image (image 2)" />
                <TextIn state={f} mid="summary-img3-alt" title="text if image fails to load" />
                <TextAr state={f} mid="summary-why" title="text" />

                <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
                <TextIn state={f} mid="process-intro" title="intro text" />
                {f.values["process-steps"].map((step, i) =>{
                    // return <TextInD state={f} mid="process-steps" i={i} title={`step ${i}`} key={i}/>
                    return <>
                        <TextIn state={f} path={["process-steps", i, 'step-name']} i={i} title={`step ${i+1}`} key={i}/>
                    </>
                })}
                <button type="button" className={styles["submit"]} onClick={updateSteps}>add step</button>  

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


function TextInD({state, mid, title}){
    const isErr = state.errors[mid] && state.touched[mid]
    const input_css = classNames(styles["textarea-smol"], {[styles["textarea-err"]]: isErr})
    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            <p>{`${title}`}</p>
            {isErr ? <pre className={styles['label-err']}>{` - ${state.errors[mid]}`}</pre>:null}
        </label>
        <input 
            id={mid}
            className={input_css} 
            type="text" 
            value={state.values[mid]}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
         />    
    </div>

}

//works if the id is the path (i.e 'process-steps.0.step-name') and the value is the object (i.e) f.values['process-steps'][0]['step-name']
function TextIn({state, mid, path, title}){

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
            <p>{`${title}`}</p>
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
function SmolAr({mid, title}){
    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>{title}</label>
        {/* <span className="textarea" role="textbox" contentEditable></span>   */}
        <textarea className={styles["textarea-smol"]} id={mid} name="text" required></textarea>
    </div>
}


function TextAr({state, mid, title}){
    return <div className={styles["section"]}>
        <label className={styles["label"]} htmlFor={mid}>
            {`${title}`}
            {state.errors[mid] && state.touched[mid] ? <p>{state.errors[mid]}</p>:null}
        </label>
        <textarea 
            id={mid}
            className={styles["textarea-big"]} 
            type="text" 
            value={state.values[mid]}
            onChange={state.handleChange}
            onBlur={state.handleBlur}
         />    
    </div>
}

function Space({mid, title}){
    return <div className={styles["space"]}>
    </div>
}


export default Create