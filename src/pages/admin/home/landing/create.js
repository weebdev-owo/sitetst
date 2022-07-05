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
            cmsPath={pagePath} // the folder in cms/data which corresponds to the data in this page
            idPath={'order'} //the path in values to the unique id of this data
            modelPath={'home_landing'}
            validationPath={`${pagePath}/create`} //path to page
            revalidate={['/']} //pages to perform on demand isr
            viewUrl={(v)=>'/'}
        >
            {formElements}
        </CmsCreateForm>
    </>
}