import {memo, useRef, useState} from 'react'
import styles from './create.module.sass'
import {useField, useFormikContext, useFormik, Formik} from 'formik'
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
            <Formik initialValues={initialValues} onSubmit={sendToAPI} validationSchema={yup_validation}>{(f) =>{console.log(f.errors);
                return <form className={styles["form"]} onSubmit={f.handleSubmit} autoComplete="off">
                <div className={styles['page-section']}>
                    <TextArea name={"url2"} label={`Testor`} />
                    <Text name="url" label="name (https://domain/serivices/'name')" />
                    <CheckBox name="disable" label="disabled (stored in database but will not appear on website)" />
                    <CheckBox name="booking" label="show in booking form (selectable in booking form services)" />
                </div>

                <div className={styles["sub-heading"]}>Service Tile Data</div>

                <div className={styles['page-section']}>
                    <Text name="tile-order" label="order (where the service is placed on services grid)" />
                    <Text name="tile-name" label="name" />
                    <TextArea name="tile-desc" label="description" />
                    <Text name="tile-img" label="background image" />
                    <Text name="tile-img-alt" label="text if image fails to load" />
                </div>

                <div className={styles["sub-heading"]}>Service Page Data</div>

                <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
                <div className={styles['page-section']}>
                    <Text name="intro-name" label="name" />
                    <TextArea name="intro-desc" label="description" />
                    <Text name="intro-img" label="background image" />
                    <Text name="intro-img-alt" label="text if image fails to load" />
                </div>

                <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
                <div className={styles['page-section']}>
                    <div className={""}>Statements (part 1)</div>
                    <Text name="summary-s1" label="statement1" />
                    <Text name="summary-s2" label="statement2" />
                    <Text name="summary-s3" label="statement3" />
                    <Text name="summary-img1" label="statement image (image 1)" />
                    <Text name="summary-img1-alt" label={`text if image will not load (alt)`} />
                    <Space />
                    <div className={""}>What (part 2)</div>
                    <TextArea name="summary-what" label="text" />
                    <Text name="summary-img2" label="image (image 2)" />
                    <Text name="summary-img2-alt" label={`text if image will not load (alt)`} />

                    <Space />
                    <div className={""}>Why (part 3)</div>
                    <TextArea name="summary-why" label="text" />
                    <Text name="summary-img3" label="image (image 3)" />
                    <Text name="summary-img3-alt" label={`text if image will not load (alt)`} />

                </div>

                <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
                <div className={styles['page-section']}>
                    <TextArea name="process-intro" label="intro text" />
                    <ListIn f={f} conatinerName={"process-steps"} item_template={step} item_name={"Step"}>
                        {(i) =>{return <div>
                            <Text path={["process-steps", i, 'step-name']} i={i} label={`step ${i+1} title`} key={i}/>
                            <Text path={["process-steps", i, 'step-desc']} i={i} label={`step ${i+1} description`} key={i}/>
                            <Text path={["process-steps", i, 'step-img']} i={i} label={`step ${i+1} image`} key={i}/>
                            <Text path={["process-steps", i, 'step-img-alt']} i={i} label={`text if image will not load (alt)`} key={i}/>
                        </div>}}
                    </ListIn>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 4: Info/Faq</div>
                <div className={styles['page-section']}>
                    <TextArea name="faq-intro" label="intro text" />
                    <ListIn f={f} conatinerName={"faq-items"} item_template={question} item_name={"Question"}>
                        {(i) =>{return <div>
                            <Text path={["faq-items", i, 'faq-question']} i={i} label={`question`} key={i}/>
                            <TextArea path={["faq-items", i, 'faq-answer']} i={i} label={`answer`} key={i}/>
                        </div>}}
                    </ListIn>
                </div>

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>Create Service</button>   
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

function ListIn({f, conatinerName, children, item_template, item_name}){
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
function Space({}){
    return <div className={styles["space"]}></div>
}


export default Create