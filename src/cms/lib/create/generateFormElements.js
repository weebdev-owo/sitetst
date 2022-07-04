import styles from '/src/cms/lib/create/cms.module.sass'
import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/create/primitives'
import * as Yup from 'yup'

function createByPath(obj, path, val){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((key) =>{
        if(Object.hasOwn(res, key)){res = res[key]}
        else{
            if(parseInt(key)){res[key] = []}
            else{res[key] = {}}
            res = res[key]
        }
    })
    res[final] = val
}

function getYup(schema, key){
    if (Object.hasOwn(schema, 'fields')){ return schema['fields'][key]}
    return schema
}

function setYup(schema, key, val){
    schema['fields'][key] = val
    schema['_nodes'].push(key)
}

function getYupByPath(obj, path){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach((key) =>{
        if(Object.hasOwn(res['fields'], key)){res = getYup(res, key)}
    })
    return res
}

function setYupByPath(obj, path, val){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((key) =>{
        if(Object.hasOwn(res['fields'], key)){res = getYup(res, key)}
        else{
            if(parseInt(key)){setYup(res, key, Yup.array())}
            else{setYup(res, key, Yup.object().shape({}))}
            res = getYup(res, key)
        }
    })
    setYup(res, final, val)
}

function setIV(val){ return {'iv': val} }

function decodeItem(item){
    const res = [undefined, undefined]
    if (item.length <= 1){ return res }
    if (Object.hasOwn(item.at(-1), 'iv')){res[0] = item.at(-1)['iv']}
    if (Object.hasOwn(item.at(-2), 'iv')){res[0] = item.at(-2)['iv']}
    if (Object.hasOwn(item.at(-1), 'exclusiveTests') && Object.hasOwn(item.at(-1), 'spec') && Object.hasOwn(item.at(-1), 'tests')){res[1] = item.at(-1)}
    if (Object.hasOwn(item.at(-2), 'exclusiveTests') && Object.hasOwn(item.at(-2), 'spec') && Object.hasOwn(item.at(-2), 'tests')){res[1] = item.at(-2)}
    return res.map((config) => (typeof config === 'function') ? config():config)
}

//SUPPORTED PRIMITIVES ['text', 'textarea', 'checkbox', 'image', 'list', 'space' ]
//note can place 'any text anywhere except for at the page level' (a page cannot be a string, but i can contain them, sections can be strings or contain them)

//INITIAL VALUES
const img = {
    "original": undefined,
    "cropped": undefined,
    "url": undefined,
    "alt": undefined
}
const primitiveInitialValue = {
    "text": () => undefined,
    "textarea": () =>undefined, 
    "checkbox": () => undefined, 
    "image": () => img, 
    "list": () => [], 
}


//YUP VALIDATION
const kb = 1000
const mb = 1000*kb
const MAX_FILE_SIZE = 10*mb
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const SUPPORTED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif']

const valid = {
    any: () => Yup.object({}),
    bool: () => Yup.boolean(),
    int: (min, max) => Yup.number()
        .typeError('must be a number')
        .integer('must be an integer')
        .min(min, `must be ${min} or greater`)
        .max(max, `must be ${max} or smaller`)
        .required('required'),
    text: (num_chars) => Yup.string()
        .matches(/^[\.a-zA-Z0-9,!? ]*$/, "only letters, numbers, spaces and punctuation allowed")
        .max(num_chars, `max length ${num_chars} chars`)
        .required("required"),
    image_file: () => Yup.mixed() 
        .test('fileSize', `file must be less than ${MAX_FILE_SIZE/mb}mb`, value => value ? value.size<=MAX_FILE_SIZE:true) 
        .test('fileType', `file must be a ${SUPPORTED_FILE_EXTENSIONS}`, value => value ? SUPPORTED_FORMATS.includes(value.type):true),
    name: (num_chars) => Yup.string()
        .max(num_chars,`max length ${num_chars} chars`)
        .matches(/^(?![0-9]*$)[a-zA-Z0-9]+$/, "only letters or numbers allowed")
        .matches(/^[A-Za-z].*/, "file name should not start with special characters")
        .matches(/^[^\\/:\*\?"<>\|]+$/,' forbidden characters \ / : * ? " < > |')
        .matches(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!aux$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/, 'forbidden file name')
        .required("required"),
    img: () => Yup.object().shape({
        alt: valid.text(100),
        url: Yup.string().url().nullable().when('cropped', {
            is: undefined,
            then: Yup.string().url().required('must have a url if no valid cropped image file exists')
        }),
        cropped: valid.image_file().when('url', {
            is: undefined,
            then: valid.image_file().required('required')
        }),
    }, [['url', 'cropped']]),
    list: (label, minn, maxx, innerSchema) => Yup.array().of(innerSchema)
        .min(minn, `must have more than ${minn-1} ${label}s`)
        .max(maxx, `can only have up to ${maxx} ${label}s`)
        .required('requred')
}

const dep_valid = {
    any: (dep_sibling_name, dep_sibling_val=true) => Yup.object({})        
        .when(dep_sibling_name, {
            is: dep_sibling_val,
            then: (schema) => schema.required('required'),
            otherwise: (schema) => schema
        }),
    bool: (dep_sibling_name, dep_sibling_val=true) => Yup.boolean()        
        .when(dep_sibling_name, {
            is: dep_sibling_val,
            then: (schema) => schema.required('required'),
            otherwise: (schema) => schema
        }),
    int: (min, max, dep_sibling_name, dep_sibling_val=true) => Yup.number()        
        .typeError('must be a number ree')
        .integer('must be an integer')
        .min(min, `must be ${min} or greater`)
        .max(max, `must be ${max} or smaller`)
        .when(dep_sibling_name, {
                is: dep_sibling_val,
                then: (schema) => schema.required('required'),
                otherwise: (schema) => schema
        }),
    text: (num_chars, dep_sibling_name, dep_sibling_val=true) => Yup.string()
        .matches(/^[\.a-zA-Z0-9,!? ]*$/, "only letters, numbers, spaces and punctuation allowed")
        .max(num_chars, `max length ${num_chars} chars`)
        .when(dep_sibling_name, {
            is: dep_sibling_val,
            then: (schema) => schema.required('required'),
            otherwise: (schema) => schema
        }),
    image_file: () => Yup.mixed() 
        .test('fileSize', `file must be less than ${MAX_FILE_SIZE/mb}mb`, value => value ? value.size<=MAX_FILE_SIZE:true) 
        .test('fileType', `file must be a ${SUPPORTED_FILE_EXTENSIONS}`, value => value ? SUPPORTED_FORMATS.includes(value.type):true),
    name: (num_chars, dep_sibling_name, dep_sibling_val=true) => Yup.string()
        .max(num_chars,`max length ${num_chars} chars`)
        .matches(/^(?![0-9]*$)[a-zA-Z0-9]+$/, "only letters or numbers allowed")
        .matches(/^[A-Za-z].*/, "file name should not start with special characters")
        .matches(/^[^\\/:\*\?"<>\|]+$/,' forbidden characters \ / : * ? " < > |')
        .matches(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!aux$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/, 'forbidden file name')
        .when(dep_sibling_name, {
            is: dep_sibling_val,
            then: (schema) => schema.required('required'),
            otherwise: (schema) => schema
        }),
    img: (dep_sibling_name, dep_sibling_val=true) => Yup.object().shape({
        alt: dep_valid.text(100, dep_sibling_name, dep_sibling_val),
        url: Yup.string().url().nullable().when(['cropped', dep_sibling_name], {
            is: (cropped, dep_sibling_name) => typeof cropped === 'undefined' && dep_sibling_name === dep_sibling_val ,
            then: Yup.string().url().required('must have a url if no valid cropped image file exists'),
            otherwise: (schema) => schema
        }),
        cropped: dep_valid.image_file().when(['url', dep_sibling_name], {
            is: (url, dep_sibling_name) => {console.log('REEEEEEEEEEEEEEEEEE', url, dep_sibling_name); return typeof url === 'undefined' && dep_sibling_name === dep_sibling_val},
            then: (schema) => schema.required('required'),
            otherwise: (schema) => schema
        }),
    }, [['url', 'cropped']]),
    list: (label, minn, maxx, innerSchema, dep_sibling_name, dep_sibling_val=true) => Yup.array().of(innerSchema)
        .min(minn, `must have more than ${minn-1} ${label}s`)
        .max(maxx, `can only have up to ${maxx} ${label}s`)
        .when(dep_sibling_name, {
            is: dep_sibling_val,
            then: (schema) => schema.required('required'),
            otherwise: (schema) => schema
        }),
}

const primitiveYup = {
    "text":() => valid.text(200),
    "textarea":() => valid.text(2000), 
    "checkbox":() => valid.bool(), 
    "image":() => valid.img(), 
    "list": (label, innerSchema) => valid.list(label, 1, 100, innerSchema), 
}


//FORM
const primitiveCreateElement = {
    "space": () => { return <Space /> },
    "text": (name, label) => { return <Text name={name} label={label} /> },
    "textarea": (name, label) => { return <TextArea name={name} label={label} /> }, 
    "checkbox": (name, label) => { return <CheckBox name={name} label={label} /> }, 
    "image": (name, label, style) => { return <FormImage name={name} label={label} image_style={style} /> }, 
    "list": (name, item_label, content, iv, iy, createElement, validationSchema, list_iy) => {
        const template = {}
        const innerSchema = Yup.object().shape({})
        content.forEach(item => {
            if(item.length > 1 && typeof item !== 'string'){ 
                const [config_iv, config_iy] = decodeItem(item)
                createByPath(template, item[1][0], config_iv || iv[item[0]]())
                if(item[0] !== 'list'){setYupByPath(innerSchema, item[1][0], config_iy || iy[item[0]]())}
            }
        })
        setYupByPath(validationSchema, name, list_iy || iy['list'](item_label, innerSchema))
       
        const list_content = (i, list_name) => {
            return <div>
                {content.map((item) =>{
                    if(typeof item ==='string'){ return <div>{item}</div> }
                    else if (item.length === 1){ return createElement[type]() }
                    else {
                        const type = item[0]
                        if (type === 'list'){ return createElement[type](`${list_name}.${i}.${item[1][0]}`, ...item[1].slice(1), item[2], iv, createElement) }
                        else{  return createElement[type](`${list_name}.${i}.${item[1][0]}`, ...item[1].slice(1)) }
                    }
                })}
            </div>
        }
        return <List name={name} item_template={template} item_label={item_label}>
            {list_content}
        </List>
    }, 
}

function generateForm(formTemplate, options={}){

    //read options
    const iv = options.iv ? options.iv : primitiveInitialValue
    const iy = options.iy ? options.iy : primitiveYup
    const createElement = options.createElement ? options.createElement : primitiveCreateElement
    const initialValues = options.initialValues ? JSON.parse(JSON.stringify(options.initialValues)) : {}
    const validationSchema = options.validationSchema ? options.validationSchema : Yup.object().shape({})
    const form = options.form ? options.form : []

    //fill form
    formTemplate.forEach((page)=>{
        //if page title add it
        if(typeof page[0] === 'string'){
            const page_title = page.splice(0, 1)
            form.push(<div className={styles["sub-heading"]}>{page_title}</div>)
        }
        //add each page tot the form
        page.forEach((section) =>{
            
            if (typeof section === 'string'){ form.push(<div className={styles["page-desc"]}>{section}</div>)}
            else{
                //if section title add it to form
                if(typeof section[0] === 'string'){
                    const section_title = section.splice(0, 1)
                    form.push(<div className={styles["sub-sub-heading"]}>{section_title}</div>)
                }
    
                //add each primitive element to the page_section
                const page_section = []
                section.forEach((item) =>{
                    const type = item[0]
                    if(typeof item ==='string'){page_section.push(<div className={styles["section-desc"]}>{item}</div>)}
                    else if(item.length === 1){ createElement[type]() }
                    else {
                        const [config_iv, config_iy] = decodeItem(item)
                        createByPath(initialValues, item[1][0], config_iv || iv[type]())
                        if(type !== 'list'){setYupByPath(validationSchema, item[1][0], config_iy || iy[type]())}
                        if (type === 'list'){ page_section.push(createElement[type](...item[1], item[2], iv, iy, createElement, validationSchema, config_iy)) }
                        else{ page_section.push(createElement[type](...item[1])) }
                    }
                    
                })
                //add page_section to form
                form.push(<div className={styles['page-section']}>{page_section}</div>)
            }

        })
    })
    // if(false){ 
    //     console.log('INITAL VALUES GENERATED', 
    //     initialValues.service.process.steps === initialValues.service.faq.items,
    //     initialValues
    //     ) 
    //     console.log(
    //         'VALIDATION SCHEMA GENERATED', 
    //         'process', getYupByPath(validationSchema, "service.process.steps").innerType.fields,
    //         'faq', getYupByPath(validationSchema, "service.faq.items").innerType.fields ,
    //     )
    // }
    if (options?.addIv){
        for (const newIv of options.addIv){
            createByPath(initialValues, newIv[0], newIv[1])
        }
    }

    return [form, initialValues, validationSchema]
}

export default generateForm
export {setIV, valid, dep_valid}

