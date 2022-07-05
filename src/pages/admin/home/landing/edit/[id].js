//frontend
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import generateForm, {setIV, valid} from '/src/cms/lib/edit/generateFormElements'
import * as editPrimitives from '/src/cms/lib/edit/generateFormPrimitives'
import {generate_template} from '/src/cms/data/models/home_landing'

const template = generate_template(editPrimitives, setIV, valid)
console.log(template)
const [formElements, initialValues, validationSchema] = generateForm(template)
export {validationSchema as editValidationSchema}


const pagePath = 'home/landing'
export default function Page({data}){
    return <>
        <CmsEditForm 
            data={data}
            validationSchema={validationSchema}
            cmsTitle={'Landing Slide'}
            cmsPath={pagePath} // the folder in cms/data which corresponds to the data in this page
            idPath={'order'} //the path in values to the unique id of this data
            modelPath={'home_landing'}
            validationPath={`${pagePath}/edit/[id]`} //path to page
            revalidate={['/']} //pages to perform on demand isr
            viewUrl={(v)=>'/'}
        >
            {formElements}
        </CmsEditForm>
    </>
}

//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Model from '/src/cms/data/models/home_landing'
import {getFormData} from '/src/cms/lib/edit/cmsEditForm'

export async function getServerSideProps(context){
    const id = context.params.id
    const connection = await dbConnect()
    return await getFormData(id, 'uid', Model)
}

