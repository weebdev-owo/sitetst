//MODEL
import createPageData from '/src/cms/lib/models/createPageData'
import imgSchema from '/src/cms/lib/models/schemas/img'
import image_styles from '/src/styles/images.module.sass'
import firstUpper from '/src/cms/lib/utils/firstUpper'

const page_name = 'services'
const section_name = 'intro'

const pageData = createPageData({
    page_name: page_name,
    section_name: section_name,
    data:{
        "desc": {type: String},
        "img": imgSchema,
    },
    reorder_paths: [],
    generate_template: (primitives, setIV, valid) =>{
        const {text, textarea, checkbox, image, list, space} = primitives
        return [
            [`${firstUpper(page_name)} Page`,
                [
                    textarea('desc', `intro text`, valid.text(500)),
                    image('img', `intro image`, image_styles['landing-car']),
                ],
            ]
        ]
    } 

})

const { createValidationSchema, editValidationSchema, createForm, editForm, model} = pageData
export { createValidationSchema, editValidationSchema, createForm, editForm, model}