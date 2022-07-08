import generateModel from '/src/cms/lib/models/gernerateModel'
import image_styles from '/src/styles/images.module.sass'

//MODEL
const model_name = 'PageData_ServicesIntro'
const reorder_paths = []
const data = {
    "desc": {type: String},
    "img": {"url": {type: String}, "alt": {type: String}}
}
const model = generateModel(model_name, reorder_paths, data, {
	uid_type: String,
    uid_default: 'PageData/services/intro',
    collection_name: 'PageData'
})


//FORM
import generateCreateForm from '/src/cms/lib/create/generateCreateForm'
import generateEditForm from '/src/cms/lib/edit/generateEditForm'

const page_name = 'services'
const section_name = 'intro'

const configs = {
    cmsTitle: `${page_name} ${section_name}`,
    cmsPagePath: `PageData/${page_name}/${section_name}`, 
    cmsFilePath: `PageData/${page_name}_${section_name}`, 
    idPath: '', 
    revalidate: [`/${page_name}`], 
    viewUrl: (v)=>`/${page_name}`, 
    editUrl: (v) =>`/admin/PageData/${page_name}/${section_name}`,
    viewText: (v)=>`view ${page_name}`,
    editText: (v)=>`edit ${page_name} ${section_name}`,
    isPageData: true,
}

const generate_template = (primitives, setIV, valid) =>{
    const {text, textarea, checkbox, image, list, space} = primitives
    return [
        [//'Services Page',
            [//'Intro',
                textarea('desc', `intro text`, valid.text(500)),
                image('img', `intro image`, image_styles['landing-car']),
            ],
        ]
    ]
} 

const [createValidationSchema, createForm] = generateCreateForm(configs, generate_template)
const [editValidationSchema, editForm] = generateEditForm(configs, generate_template)


export { createValidationSchema, editValidationSchema, createForm, editForm, model}