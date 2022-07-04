// //frontend
import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import {getByPath} from '/src/cms/lib/utils/byPath'

function CmsUpsertForm({foundCmsPageData, eIVs, eVS, eFEs, cIVs, cVS, cFEs, ...props}){

    if(foundCmsPageData){ return <>
        <CmsEditForm 
            data={eIVs}
            validationSchema={eVS}
            {...props}
        >
            {eFEs}
        </CmsEditForm>
    </>}

    return <>
        <CmsCreateForm 
            initialValues={cIVs}
            validationSchema={cVS}
            {...props}
        >
            {cFEs}
        </CmsCreateForm>
    </>

}

async function getFormData(id, id_path, Model){
    let data = false
    try {
        data = await Model.find()
            .select(['data'])
            .where(`data.${id_path}`).eq(id)
        if (data.length > 1){throw 'Invalid number of objects matching this id'}
        // console.log('inside server side props', data[0].data)
        const initialValues = data?.[0]?.data
        
        return {
            props: {
                data: initialValues ? JSON.parse(JSON.stringify(initialValues)):null,
                foundCmsPageData: data.length === 1 && initialValues ? true:false
            }
        }
    } 
    catch (error) {
        console.log('inside get props error', error)
        return {notFound: true}
    }
}

export {getFormData}
export default CmsUpsertForm