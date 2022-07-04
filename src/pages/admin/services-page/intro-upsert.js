//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Model from '/src/cms/data/pageCms/services-page/intro/model'
//frontend
import CmsUpsertForm, {getFormData} from '/src/cms/lib/upsert/cmsUpsertForm'
import {formElements as cFEs, initialValues as cIVs, validationSchema as cVS} from '/src/cms/data/pageCms/services-page/intro/create'
import {formElements as eFEs, validationSchema as eVS} from '/src/cms/data/pageCms/services-page/intro/edit'
import {getByPath} from '/src/cms/lib/utils/byPath'


const unique_id_path = 'pageCmsId'
const page_name = 'services'
const section_name = 'intro'
const unique_id = `${page_name}-page/${section_name}`

export default function Page({data, foundCmsPageData}){
    return <>
        <CmsUpsertForm 
            cFEs={cFEs} cIVs={cIVs} cVS={cVS} eFEs={eFEs} eIVs={data} eVS={eVS}
            foundCmsPageData={foundCmsPageData}
            cmsTitle={`${page_name} ${section_name}`}
            id_path={unique_id_path} //the path in values to the unique id of this data
            cmsPath={`pageCms/${unique_id}`} // the folder in cms/data which corresponds to the data in this page
            revalidate={[`/${page_name}`]} //pages to perform on demand isr
            viewUrl={(v)=>`/${page_name}`}
            editUrl={(values) => `/admin/${getByPath(values, unique_id_path)}-upsert`}
            viewText={(v)=>`view ${page_name}`}
            editText={(v)=>`edit ${page_name} ${section_name}`}
            pageCms={true}
        />
    </>
}

export async function getServerSideProps(){
    const connection = await dbConnect()
    return await getFormData(unique_id, unique_id_path, Model)
}

