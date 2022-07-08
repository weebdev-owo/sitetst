import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import generateFormComponents, {setIV , valid } from '/src/cms/lib/create/generateFormElements'
import * as primitives from '/src/cms/lib/create/generateFormPrimitives'


const generateCreateForm = (config, generateTemplate) =>{
    const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl, viewText, editText, isPageData} = config
    const template = generateTemplate(primitives, setIV, valid)
    const [formElements, initialValues, validationSchema] = generateFormComponents(template)
    const createForm = () => <CmsCreateForm 
            initialValues={initialValues}
            validationSchema={validationSchema}
            cmsTitle={cmsTitle}
            cmsPath={pagePath}
            idPath={idPath}
            modelPath={modelPath}
            validationPath={`${pagePath}/create`}
            revalidate={revalidate}
            viewUrl={viewUrl}
            editUrl={editUrl}
            viewText={viewText}
            editText={editText}
            pageCms={isPageData}
        >
            {formElements}
    </CmsCreateForm>
    return [validationSchema, createForm]
}

export default generateCreateForm