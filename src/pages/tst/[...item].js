//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import {getFormData} from '/src/cms/lib/edit/cmsEditForm'
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import Error from 'next/error'
import {useState, useEffect} from 'react'

const cmsImport = async (path, type, setCms) =>{
    const cms = await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ 
        `/src/cms/data/models/${modelPath}`
    )
    const {createValidationSchema, editValidationSchema, createForm, editForm, initialValues, configs, model} = await cms
    if (type === 'create') {createValidationSchema, createForm, editForm, initialValues, configs, model} = await cms
}

export default function Page({ctxt, form_path, data}){
    console.log(ctxt)
    const [cms, setCms] = useState(null)
    useEffect(() =>{

    }, [])
    if (!form_path){return <Error statusCode={"404"} />}
    const {cmsTitle, pagePath, idPath, modelPath, revalidate, viewUrl, editUrl} = configs

    if(data){ return <>
        {/* const { editValidationSchema, editForm, configs } = cmsImport() */}

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
    </>}

    return <>CREATE FORM</>

}

export async function getServerSideProps(context){
    const url = context.params.item
    let form_path = false
    let data = false
    console.log(context.res.statusCode)
    try{
        if (url.at(-1) === 'create'){
            if (url.length === 3) form_path = `${url[0]}_${url[1]}`
            if (url.length === 2) form_path = url[0]
        }
        else if (url.at(-2) === 'edit'){
            if (url.length === 4) form_path = `${url[0]}_${url[1]}`
            if (url.length === 3) form_path = url[0]
            const model = await (await import(`/src/cms/data/item/${form_path}`)).default
            const connection = await dbConnect()
            data = await getFormData(url.at(-1), model)
        }
    }
    catch (error){console.log(error); form_path = false; data=false;}

    return {
        props: {
            ctxt: JSON.parse(JSON.stringify(context.params)),
            form_path: form_path, 
            data: data,
        }
    }
}