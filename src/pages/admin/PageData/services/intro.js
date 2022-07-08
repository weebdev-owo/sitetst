import Model, {generate_template, configs} from '/src/cms/data/models/PageData/services_intro'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
// import Model from '/src/cms/data/pageCms/services-page/intro/model'
//frontend
import CmsUpsertForm, {getFormData} from '/src/cms/lib/upsert/cmsUpsertForm'
import cGenerateForm, {setIV as cSetIV, valid as cValid} from '/src/cms/lib/create/generateFormElements'
import * as createPrimitives from '/src/cms/lib/create/generateFormPrimitives'
import eGenerateForm, {setIV as eSetIV, valid as eValid} from '/src/cms/lib/edit/generateFormElements'
import * as editPrimitives from '/src/cms/lib/edit/generateFormPrimitives'
// import {formElements as cFEs, initialValues as cIVs, validationSchema as cVS} from '/src/cms/data/pageCms/services-page/intro/create'
// import {formElements as eFEs, validationSchema as eVS} from '/src/cms/data/pageCms/services-page/intro/edit'
import {getByPath} from '/src/cms/lib/utils/byPath'


// const unique_id_path = 'pageCmsId'
// const page_name = 'services'
// const section_name = 'intro'
// const unique_id = `${page_name}-page/${section_name}`

const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl, viewText, editText} = configs

const cTemplate = generate_template(createPrimitives, cSetIV, cValid)
const [cFEs, cIVs, cVS] = cGenerateForm(cTemplate)
const eTemplate = generate_template(editPrimitives, eSetIV, eValid)
const [eFEs, eIVs, eVS] = eGenerateForm(eTemplate)
export {cVS as createValidationSchema, eVS as editValidationSchema}

export default function Page({data, foundCmsPageData}){
    return <>
        <CmsUpsertForm 
            cFEs={cFEs} cIVs={cIVs} cVS={cVS} eFEs={eFEs} eIVs={data} eVS={eVS}
            foundCmsPageData={foundCmsPageData}
            // cmsTitle={`${page_name} ${section_name}`}
            // id_path={unique_id_path} //the path in values to the unique id of this data
            // cmsPath={`pageCms/${unique_id}`} // the folder in cms/data which corresponds to the data in this page
            // revalidate={[`/${page_name}`]} //pages to perform on demand isr
            // viewUrl={(v)=>`/${page_name}`}
            // editUrl={(values) => `/admin/${getByPath(values, unique_id_path)}-upsert`}

            cmsTitle={cmsTitle}
            cmsPath={pagePath}
            idPath={idPath}
            modelPath={modelPath}
            validationPath={pagePath}
            revalidate={revalidate}
            viewUrl={viewUrl}
            editUrl={editUrl}
            viewText={viewText}
            editText={editText}
            pageCms={true}
        />
    </>
}

export async function getServerSideProps(){
    const connection = await dbConnect()
    return await getFormData(Model)
}

