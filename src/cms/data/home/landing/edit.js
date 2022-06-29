import image_styles from '/src/styles/images.module.sass'
import generateForm, {setIV, valid} from '/src/cms/lib/edit/generateFormElements'
import {text, textarea, checkbox, image, list, space} from '/src/cms/lib/edit/generateFormPrimitives'
// import * as Yup from 'yup'

const template = [
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

const [formElements, initialValues, validationSchema] = generateForm(template)
export {formElements, initialValues, validationSchema}

