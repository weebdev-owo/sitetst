//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import {getFormData} from '/src/cms/lib/edit/cmsEditForm'
import Error from 'next/error'
import {useState, useEffect} from 'react'
import LoadingPage from '/src/cms/lib/comps/LoadingPage/LoadingPage'

const cmsImportForm = async (path, type, setForm) =>{
    try {
        let form = 'error'
        const cms = await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ 
            `/src/cms/data/collections/${path}`
        )
        if (type === 'create') form = await cms.createForm
        if (type === 'edit') form = await cms.editForm
        setForm(form)
    }
    catch (error){ console.log(error); setForm('error') }
}

export default function Page({ctxt, form_path, data}){

    const [form, setForm] = useState(null)

    useEffect(() =>{
        if(data) cmsImportForm(form_path, 'edit', setForm)
        else cmsImportForm(form_path, 'create', setForm)
    }, [data, form_path])

    if (!form_path || form === 'error') return <Error statusCode={"404"} />
    if(!form) return <LoadingPage content={'LOADING'}/>

    if(data) return <>{form(data)}</>
    return <>{form()}</>
}

export async function getServerSideProps(context){
    const url = context.params.item
    let form_path = false
    let data = false

    try{
        if (url.at(-1) === 'create'){
            if (url.length === 3) form_path = `${url[0]}_${url[1]}`
            else if (url.length === 2) form_path = url[0]
            else throw 'invalid url'
        }
        else if (url.at(-2) === 'edit'){
            if (url.length === 4) form_path = `${url[0]}_${url[1]}`
            else if (url.length === 3) form_path = url[0]
            else throw 'invalid url'
            const model = await (await import(`/src/cms/data/collections/${form_path}`)).model
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