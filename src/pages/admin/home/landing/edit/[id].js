//frontend
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import {formElements, validationSchema} from '/src/cms/data/home/landing/edit'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Model from '/src/cms/data/home/landing/model'


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
    let data = false
    try {
        const connection = await dbConnect()
        data = await Model.find()
            .select(['data'])
            .where('data.order').eq(id)
        if (data.length !== 1){throw 'Invalid number of objects matching this id'}
        // console.log('inside server side props', data[0].data)
        const initialValues = data[0].data
        
        return {
            props: {
                data: JSON.parse(JSON.stringify(initialValues))
            }
        }
    } 
    catch (error) {
        console.log('inside static props error', error)
        return {notFound: true}
    }
}

