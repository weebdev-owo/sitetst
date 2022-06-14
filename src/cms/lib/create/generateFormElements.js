import styles from '/src/cms/lib/create/cms.module.sass'
import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/create/primitives'
import image_styles from '/src/styles/images.module.sass'

// export const initialValues = {}
const img = {
    "original": null,
    "cropped": null,
    "url": "",
    "alt": "edit for better seo"
}

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

const primitiveInitialValue = {
    "text": '',
    "textarea": '', 
    "checkbox": false, 
    "image": img, 
    "list": [], 
}

const primitiveCreateElement = {
    "space": () => { return <Space /> },
    "text": (name, label) => { return <Text name={name} label={label} /> },
    "textarea": (name, label) => { return <TextArea name={name} label={label} /> }, 
    "checkbox": (name, label) => { return <CheckBox name={name} label={label} /> }, 
    "image": (name, label, style) => { return <FormImage name={name} label={label} image_style={style} /> }, 
    "list": (name, item_label, content, iv, createElement) => {
        const template = {}
        const list_content = (i, list_name) => {
            return <div>
                {content.map((item) =>{
                    if(typeof item ==='string'){ return <div>{item}</div> }
                    else if (item.length === 1){ return createElement[type]() }
                    else {
                        const type = item[0]
                        createByPath(template, item[1][0], iv[type])
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

export default function generateForm(title, formTemplate, showIV=false, createElement=primitiveCreateElement, iv=primitiveInitialValue ){
    const initialValues = {}
    const form = []

    //fill form
    formTemplate.forEach((page)=>{
        //if page title add it
        if(typeof page[0] === 'string'){
            const page_title = page.splice(0, 1)
            form.push(<div className={styles["sub-heading"]}>{page_title}</div>)
        }
        //add each page tot the form
        page.forEach((section) =>{
            //if section title add it to form
            if(typeof section[0] === 'string'){
                const section_title = section.splice(0, 1)
                form.push(<div className={styles["sub-sub-heading"]}>{section_title}</div>)
            }

            //add each primitive element to the page_section
            const page_section = []
            section.forEach((item) =>{
                const type = item[0]
                if(typeof item ==='string'){page_section.push(<div>{item}</div>)}
                else if(item.length === 1){ createElement[type]() }
                else {
                    createByPath(initialValues, item[1][0], iv[type])
                    if (type === 'list'){ page_section.push(createElement[type](...item[1], item[2], iv, createElement)) }
                    else{ page_section.push(createElement[type](...item[1])) }
                }
                
            })
            //add page_section to form
            form.push(<div className={styles['page-section']}>{page_section}</div>)
        })
    })
    if(showIV === 'log'){ console.log('INITAL VALUES GENERATED', initialValues) }
    
    return [form, initialValues]
}


