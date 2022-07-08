import CmsEditForm from '/src/cms/lib/edit/cmsCreateForm'
import generateFormComponents, {setIV , valid } from '/src/cms/lib/edit/generateFormElements'
import * as primitives from '/src/cms/lib/edit/generateFormPrimitives'


const generateCreateForm = (config, generateTemplate) =>{
    const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl, viewText, editText, isPageData} = config
    const template = generateTemplate(primitives, setIV, valid)
    const [formElements, initialValues, validationSchema] = generateFormComponents(template)
    const editForm = (data) => <CmsEditForm 
            data={data}
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
    </CmsEditForm>
    return [validationSchema, editForm]
}

export default generateCreateForm