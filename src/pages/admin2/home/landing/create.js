//both
import { generate_template, configs } from '/src/cms/data/models/home_landing'
//frontend
import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import generateForm, {setIV, valid} from '/src/cms/lib/create/generateFormElements'
import * as createPrimitives from '/src/cms/lib/create/generateFormPrimitives'

const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl} = configs
const template = generate_template(createPrimitives, setIV, valid)
const [formElements, initialValues, validationSchema] = generateForm(template)
export {validationSchema as createValidationSchema}


export default function Page({}){
    return <>
        <CmsCreateForm 
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
        >
            {formElements}
        </CmsCreateForm>
    </>
}
