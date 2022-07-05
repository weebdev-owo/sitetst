//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import {getFormData} from '/src/cms/lib/edit/cmsEditForm'
//frontend
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import generateForm, {setIV, valid} from '/src/cms/lib/edit/generateFormElements'
import * as editPrimitives from '/src/cms/lib/edit/generateFormPrimitives'
//both
import Model, {generate_template} from '/src/cms/data/models/service'

const template = generate_template(editPrimitives, setIV, valid)
const [formElements, initialValues, validationSchema] = generateForm(template)
export {validationSchema as editValidationSchema}


const pagePath = 'service'
export default function Page({data}){
    return <>
        <CmsEditForm 
            data={data}
            validationSchema={validationSchema}
            cmsTitle={'Service'}
            cmsPath={pagePath} // the folder in cms/data which corresponds to the data in this page
            idPath={'url'} //the path in values to the unique id of this data
            modelPath={'service'}
            validationPath={`${pagePath}/edit/[id]`} //path to page
            revalidate={['/', ['service','use id']]} //pages to perform on demand isr
            viewUrl={(v)=>'/'}
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


// //frontend
// import styles from '/src/cms/lib/edit/cms.module.sass'
// import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
// import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/edit/primitives'
// import image_styles from '/src/styles/images.module.sass'
// import {useMemo, useEffect, useState, useReducer} from 'react'
// import {QueryClient, QueryClientProvider as QueryProvider, useQuery, useQueries} from 'react-query'
// import {formElements, validationSchema} from '/src/cms/data/services/edit'
// //backend
// import dbConnect from '/src/cms/lib/api/mongoose_connect'
// import Service from '/src/cms/data/services/model'


// export default function Page({data}){
//     return <>
//         <CmsEditForm 
//             data={data}
//             validationSchema={validationSchema}
//             cmsTitle={'Service'}
//             cmsPath={'services'} // the folder in cms/data which corresponds to the data in this page
//             id_path={'url'} //the path in values to the unique id of this data
//             revalidate={['/', ['services','use id']]} //pages to perform on demand isr
//         >
//             {formElements}
//         </CmsEditForm>
//     </>
// }

// export async function getServerSideProps(context){
//     const id = context.params.id
//     let data = false
//     try {
//         const connection = await dbConnect()
//         data = await Service.find()
//             .select(['data'])
//             .where('data.url').eq(id)
//         if (data.length !== 1){throw 'Invalid number of objects matching this id'}
//         // console.log('inside server side props', data[0].data)
//         const initialValues = data[0].data
        
//         return {
//             props: {
//                 data: JSON.parse(JSON.stringify(initialValues))
//             }
//         }
//     } 
//     catch (error) {
//         console.log('inside static props error', error)
//         return {notFound: true}
//     }
// }

