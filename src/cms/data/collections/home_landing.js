//MODEL
import generateModel from '/src/cms/lib/models/gernerateModel'
import imgSchema from '/src/cms/lib/models/schemas/img'
//FORM
import generateCreateForm from '/src/cms/lib/create/generateCreateForm'
import generateEditForm from '/src/cms/lib/edit/generateEditForm'
import image_styles from '/src/styles/images.module.sass'


const page_name = 'home'
const section_name = 'landing'
const model_name = `${page_name}_${section_name}-slides`
const data = {
	"enabled": {type: Boolean},
	"order": {type: Number, min: 0, max: 1000000},
	"title": {type: String},
	"desc": {type: String},
	"img": imgSchema
}
const generate_template = (primitives, setIV, valid) =>{
    const {text, textarea, checkbox, image, list, space} = primitives
    return [
        ['Home Page',
            ['Landing Slide',
                checkbox("enabled", "enabled (if not enabled will not appear on website)", setIV(true), valid.bool()),
                text("order", "order (in the home page landing section carousel)", valid.int(1, 1000)),
                text('title', `title`, valid.text(100)),
                textarea('desc', `description`, valid.text(500)),
                image('img', `carousel image`, image_styles['landing-car']),
            ],
        ]
    ]
} 

//MODEL
const reorder_paths = ['order']
const model = generateModel(model_name, reorder_paths, data, {
	uid_type: Number,
    uid_order_path: reorder_paths[0]
})


//FORM
const configs = {
    title: `Landing Slide`,
    pagePath: `/${page_name}/${section_name}`, 
    filePath: `collections/${page_name}_${section_name}`, 
    idPath: 'order', 
    revalidate: ['/'], 
    viewUrl: (v)=>'/', 
    editUrl: undefined,
    viewText: undefined,
    editText: undefined,
    isPageData: false,
}
const [createValidationSchema, createForm] = generateCreateForm(configs, generate_template)
const [editValidationSchema, editForm] = generateEditForm(configs, generate_template)

export { createValidationSchema, editValidationSchema, createForm, editForm, model}



