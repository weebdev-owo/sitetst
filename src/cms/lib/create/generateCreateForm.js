import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import generateFormComponents, {setIV , valid } from '/src/cms/lib/create/generateFormElements'
import * as primitives from '/src/cms/lib/create/generateFormPrimitives'


const generateCreateForm = (config, generateTemplate) =>{
    const {title, pagePath, filePath, idPath, revalidate, viewUrl, editUrl, viewText, editText, isPageData, initialValuesFilled, customValidationSchema} = config
    const template = generateTemplate(primitives, setIV, valid)
    const [formElements, initialValues, validationSchema] = generateFormComponents(template)
    const c1 = () => <CmsCreateForm 
            initialValues={initialValuesFilled || initialValues}
            validationSchema={customValidationSchema || validationSchema}
            cmsTitle={title}
            cmsPagePath={pagePath}
            cmsFilePath={filePath}
            idPath={idPath}
            revalidate={revalidate}
            viewUrl={viewUrl}
            editUrl={editUrl}
            viewText={viewText}
            editText={editText}
            pageCms={isPageData}
        >
            {formElements}
    </CmsCreateForm>
    const createForm = () => c1
    return [validationSchema, createForm]
}

export default generateCreateForm