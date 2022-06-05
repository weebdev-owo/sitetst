import * as Yup from 'yup'

//setup form validation
const b = 8
const kb = 1000
const mb = 1000*kb
const MAX_FILE_SIZE = 10*mb
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const SUPPORTED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif']
const title = 30
const short = 60
const para = 400

const valid_num = (min, max) => Yup.number()
    .typeError('must be a number')
    .min(min, `must be ${min} or greater`)
    .max(max, `must be ${max} or smaller`)
    .required('required')
const restricted_name = num_chars => Yup.string()
    .max(num_chars,`max length ${num_chars} chars`)
    .matches(/^(?![0-9]*$)[a-zA-Z0-9]+$/, "only letters or numbers allowed")
    .matches(/^[A-Za-z].*/, "file name should not start with special characters")
    .matches(/^[^\\/:\*\?"<>\|]+$/,' forbidden characters \ / : * ? " < > |')
    .matches(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!aux$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/, 'forbidden file name')
    .required("required")
const brief_text = (num_chars) => Yup.string()
    .matches(/^[\.a-zA-Z0-9,!? ]*$/, "only letters, numbers, spaces and punctuation allowed")
    .max(num_chars, `max length ${num_chars} chars`)
    .required("required")
const valid_array = (label, min, max, item) => Yup.array().of(Yup.object(item))
    .min(1, `must have more than ${min} ${label}`)
    .max(50, `can only have up to ${max} ${label}`)
    .required('requred')
const valid_img_file = Yup.mixed() 
    .test('fileSize', `file must be less than ${MAX_FILE_SIZE/mb}mb`, value => value ? value.size<=MAX_FILE_SIZE:true) 
    .test('fileType', `file must be a ${SUPPORTED_FILE_EXTENSIONS}`, value => value ? SUPPORTED_FORMATS.includes(value.type):true)
    .required('required')
const img_data = Yup.object({
    cropped: valid_img_file,
    alt: brief_text(short)
})

const serviceSchema = Yup.object({
    "url": restricted_name(20),
    "enabled": Yup.boolean(),
    "booking": Yup.boolean(),
    services: Yup.object({
        tile: Yup.object({
            "order": valid_num(0, 100),
            "name": brief_text(title),
            "desc": brief_text(short), 
            "img": img_data,
        }),
    }),
    service: Yup.object({
        intro: Yup.object({
            "name": brief_text(title),
            "desc": brief_text(para), 
            "img": img_data,
        }),
        summary: Yup.object({
            "s1": brief_text(title),
            "s2": brief_text(title),
            "s3": brief_text(title),
            "img1": img_data,
            "what": brief_text(para), 
            "img2": img_data,
            "why": brief_text(para), 
            "img3": img_data,
        }),
        process: Yup.object({
            "intro": brief_text(para), 
            "steps": valid_array('steps', 0, 50, {
                "name": brief_text(short),           
                "desc": brief_text(para),  
                "img": img_data,  
            }),
        }),
        faq: Yup.object({
            "intro": brief_text(para), 
            "items": valid_array('questions', 0, 50, {
                'question': brief_text(short),  
                'answer': brief_text(para),  
            }),
        }),
    })
})

export default serviceSchema