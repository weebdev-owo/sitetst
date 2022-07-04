import image_styles from '/src/styles/images.module.sass'
import generateForm, {setIV, valid} from '/src/cms/lib/edit/generateFormElements'
import {text, textarea, checkbox, image, list, space} from '/src/cms/lib/edit/generateFormPrimitives'
// import * as Yup from 'yup'
const unique_id = 'services-page/intro'
const template = [
    ['About Page',
        ['Landing Slide',
            textarea('desc', `intro text`, valid.text(500)),
            image('img', `intro image`, image_styles['landing-car']),
        ],
    ]
]

const [formElements, initialValues, validationSchema] = generateForm(template, {addIv: [['pageCmsId', unique_id]]})
export {formElements, initialValues, validationSchema}

