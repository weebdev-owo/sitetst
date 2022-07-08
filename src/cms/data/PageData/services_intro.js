// import generateModel from '/src/cms/lib/models/gernerateModel';
// import pageCmsId from '/src/cms/lib/models/schemas/pageCmsId'

// const model_name = 'servicesPage_intro'
// const reorder_paths = []
// const data = {
//     pageCmsId: pageCmsId(model_name),
//     "desc": {type: String},
// 	"img": {
// 		"url": {type: String},
// 		"alt": {type: String},
// 	}
// }

// const model = generateModel(model_name, reorder_paths, data, 'pageCms')
// export default model



import generateModel from '/src/cms/lib/models/gernerateModel'
import image_styles from '/src/styles/images.module.sass'
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'

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
const page_name = 'services'
const section_name = 'intro'

const configs = {
    cmsTitle: `${page_name} ${section_name}`,
    cmsPagePath: `PageData/${page_name}/${section_name}`, 
    idPath: '', 
    cmsFilePath: `PageData/${page_name}_${section_name}`, 
    revalidate: [`/${page_name}`], 
    viewUrl: (v)=>`/${page_name}`, 
    editUrl: (v) =>`/admin/PageData/${page_name}/${section_name}`,
    viewText: (v)=>`view ${page_name}`,
    editText: (v)=>`edit ${page_name} ${section_name}`,
    isPageData: true,
}
// cFEs={cFEs} cIVs={cIVs} cVS={cVS} eFEs={eFEs} eIVs={data} eVS={eVS}
// foundCmsPageData={foundCmsPageData}
// cmsTitle={`${page_name} ${section_name}`}
// id_path={unique_id_path} //the path in values to the unique id of this data
// cmsPath={`pageCms/${unique_id}`} // the folder in cms/data which corresponds to the data in this page
// revalidate={[`/${page_name}`]} //pages to perform on demand isr
// viewUrl={(v)=>`/${page_name}`}
// editUrl={(values) => `/admin/${getByPath(values, unique_id_path)}-upsert`}
// viewText={(v)=>`view ${page_name}`}
// editText={(v)=>`edit ${page_name} ${section_name}`}
// pageCms={true}
const generate_template = (primitives, setIV, valid) =>{
    const {text, textarea, checkbox, image, list, space} = primitives
    return [
        ['Services Page',
            ['Intro',
                textarea('desc', `intro text`, valid.text(500)),
                image('img', `intro image`, image_styles['landing-car']),
            ],
        ]
    ]
} 

import cGenerateForm, {setIV as cSetIV, valid as cValid} from '/src/cms/lib/create/generateFormElements'
import * as createPrimitives from '/src/cms/lib/create/generateFormPrimitives'
import eGenerateForm, {setIV as eSetIV, valid as eValid} from '/src/cms/lib/edit/generateFormElements'
import * as editPrimitives from '/src/cms/lib/edit/generateFormPrimitives'
import { generate_template } from '/src/cms/data/models/service';

const cTemplate = generate_template(createPrimitives, cSetIV, cValid)
const [createTemplate, initialValues, createValidationSchema] = cGenerateForm(cTemplate)
const eTemplate = generate_template(editPrimitives, eSetIV, eValid)
const [editTemplate, eIVs, editValidationSchema] = eGenerateForm(eTemplate)
// const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl} = configs

const generateCreateForm = (config, generate_template) =>{
    const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl} = configs
    return () => <CmsEditForm 
            initialValues={initialValues}
            validationSchema={createValidationSchema}
            cmsTitle={cmsTitle}
            cmsPath={pagePath}
            idPath={idPath}
            modelPath={modelPath}
            validationPath={`${pagePath}/edit/[id]`}
            revalidate={revalidate}
            viewUrl={viewUrl}
            editUrl={editUrl}
            viewText={viewText}
            editText={editText}
            pageCms={isPageData}
        >
            {createTemplate}
    </CmsEditForm>
}

const generateEditForm = (config, generate_template) =>{
    const {cmsTitle, pagePath, idPath, cmsFilePath, cmsPagePath, revalidate, viewUrl, editUrl} = configs
    return (data) => <CmsEditForm 
            data={data}
            validationSchema={createValidationSchema}
            cmsTitle={cmsTitle}
            cmsPath={pagePath}
            idPath={idPath}
            modelPath={cmsFilePath}
            validationPath={cmsFilePath}
            revalidate={revalidate}
            viewUrl={viewUrl}
            editUrl={editUrl}
            viewText={viewText}
            editText={editText}
            pageCms={isPageData}
        >
            {createTemplate}
    </CmsEditForm>
}


const editForm = (initialData) =>{
    return <CmsCreateForm 
        data={initialData}
        validationSchema={createValidationSchema}
        cmsTitle={cmsTitle}
        cmsPath={pagePath}
        idPath={idPath}
        modelPath={modelPath}
        validationPath={`${pagePath}/edit/[id]`}
        revalidate={revalidate}
        viewUrl={viewUrl}
        editUrl={editUrl}
    >{createTemplate}</CmsCreateForm>
}

export { createValidationSchema, editValidationSchema, createForm, editForm, initialValues, configs, model}