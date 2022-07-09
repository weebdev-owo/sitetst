// //MODEL
// import generateModel from '/src/cms/lib/models/gernerateModel'
// import imgSchema from '/src/cms/lib/models/schemas/img'
// //FORM
// import image_styles from '/src/styles/images.module.sass'
// import generateCreateForm from '/src/cms/lib/create/generateCreateForm'
// import generateEditForm from '/src/cms/lib/edit/generateEditForm'
// import firstUpper from '/src/cms/lib/utils/firstUpper'

// //MODEL
// const page_name = 'services'
// const section_name = 'intro'
// const reorder_paths = []

// const model_name = `PageData-${page_name}_${section_name}`

// const data = {
//     "desc": {type: String},
//     "img": imgSchema,
// }
// const model = generateModel(model_name, reorder_paths, data, {
// 	uid_type: String,
//     uid_default: `${page_name}_${section_name}`,
//     collection_name: 'PageData'
// })

// //FORM
// const configs = {
//     title: `${firstUpper(section_name)}`,
//     pagePath: `PageData/${page_name}/${section_name}`, 
//     filePath: `PageData/${page_name}_${section_name}`, 
//     idPath: '', 
//     revalidate: [`/${page_name}`], 
//     viewUrl: (v)=>`/${page_name}`, 
//     editUrl: (v) =>`/admin/PageData/${page_name}/${section_name}`,
//     viewText: (v)=>`view ${page_name}`,
//     editText: (v)=>`edit ${page_name} ${section_name}`,
//     isPageData: true,
// }

// const generate_template = (primitives, setIV, valid) =>{
//     const {text, textarea, checkbox, image, list, space} = primitives
//     return [
//         [`${firstUpper(page_name)} Page`,
//             [//'Intro',
//                 textarea('desc', `intro text`, valid.text(500)),
//                 image('img', `intro image`, image_styles['landing-car']),
//             ],
//         ]
//     ]
// } 

// const [createValidationSchema, createForm] = generateCreateForm(configs, generate_template)
// const [editValidationSchema, editForm] = generateEditForm(configs, generate_template)


// export { createValidationSchema, editValidationSchema, createForm, editForm, model}