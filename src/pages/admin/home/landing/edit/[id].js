//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Model from '/src/cms/data/home/landing/model'
//frontend
import CmsEditForm, {getFormData} from '/src/cms/lib/edit/cmsEditForm'
import {formElements, validationSchema} from '/src/cms/data/home/landing/edit'

export default function Page({data}){
    return <>
        <CmsEditForm 
            data={data}
            validationSchema={validationSchema}
            cmsTitle={'Landing Slide'}
            cmsPath={'home/landing'} // the folder in cms/data which corresponds to the data in this page
            id_path={'order'} //the path in values to the unique id of this data
            revalidate={['/']} //pages to perform on demand isr
            viewUrl={(v)=>'/'}
        >
            {formElements}
        </CmsEditForm>
    </>
}

export async function getServerSideProps(context){
    const id = context.params.id
    const connection = await dbConnect()
    return await getFormData(id, 'order', Model)
}

