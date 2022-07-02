import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import {formElements, initialValues, validationSchema} from '/src/cms/data/home/landing/create'

export default function Page(){
    // console.log('reee', initialValues)
    return <>
        <CmsCreateForm 
            initialValues={initialValues}
            validationSchema={validationSchema}
            cmsTitle={'Landing Slide'}
            cmsPath={'home/landing'} // the folder in cms/data which corresponds to the data in this page
            id_path={'order'} //the path in values to the unique id of this data
            revalidate={['/']} //pages to perform on demand isr
            viewUrl={(v)=>'/'}
        >
            {formElements}
        </CmsCreateForm>
    </>
}

