//frontend
import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import generateForm, {setIV, valid} from '/src/cms/lib/create/generateFormElements'
import * as createPrimitives from '/src/cms/lib/create/generateFormPrimitives'
//both
import { generate_template } from '/src/cms/data/models/home_landing'

const template = generate_template(createPrimitives, setIV, valid)
const [formElements, initialValues, validationSchema] = generateForm(template)
export {validationSchema as createValidationSchema}

const pagePath = 'home/landing'
export default function Page({data}){
    return <>
        <CmsCreateForm 
            initialValues={initialValues}
            validationSchema={validationSchema}
            cmsTitle={'Landing Slide'}
            cmsPath={pagePath}
            idPath={'order'} 
            modelPath={'home_landing'}
            validationPath={`${pagePath}/create`}
            revalidate={['/']}
            viewUrl={(v)=>'/'}
        >
            {formElements}
        </CmsCreateForm>
    </>
}