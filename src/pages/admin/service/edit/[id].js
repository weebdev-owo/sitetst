//both
import Model, {generate_template, configs} from '/src/cms/data/models/service'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import {getFormData} from '/src/cms/lib/edit/cmsEditForm'
//frontend
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import generateForm, {setIV, valid} from '/src/cms/lib/edit/generateFormElements'
import * as editPrimitives from '/src/cms/lib/edit/generateFormPrimitives'


const template = generate_template(editPrimitives, setIV, valid)
const [formElements, initialValues, validationSchema] = generateForm(template)
export {validationSchema as editValidationSchema}

const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl} = configs

export default function Page({data}){
    return <>
        <CmsEditForm 
            data={data}
            validationSchema={validationSchema}
            cmsTitle={cmsTitle}
            cmsPath={pagePath}
            idPath={idPath}
            modelPath={modelPath}
            validationPath={`${pagePath}/edit/[id]`}
            revalidate={revalidate}
            viewUrl={viewUrl}
            editUrl={editUrl}
        >
            {formElements}
        </CmsEditForm>
    </>
}

export async function getServerSideProps(context){
    const id = context.params.id
    const connection = await dbConnect()
    return await getFormData(id, 'uid', Model)
}

