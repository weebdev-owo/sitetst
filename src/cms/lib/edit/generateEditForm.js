import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import generateFormComponents, {setIV , valid } from '/src/cms/lib/edit/generateFormElements'
import * as primitives from '/src/cms/lib/edit/generateFormPrimitives'


const generateCreateForm = (config, generateTemplate) =>{
    const {title, pagePath, filePath, idPath, revalidate, viewUrl, editUrl, viewText, editText, isPageData} = config
    const template = generateTemplate(primitives, setIV, valid)
    const [formElements, initialValues, validationSchema] = generateFormComponents(template)
    const c1 = (data) => <CmsEditForm 
            data={data}
            validationSchema={validationSchema}
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
    </CmsEditForm>
    const editForm = (data) => c1
    return [validationSchema, editForm]
}

export default generateCreateForm