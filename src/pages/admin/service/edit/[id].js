//frontend
import styles from '/src/cms/lib/edit/cms.module.sass'
import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/edit/primitives'
import image_styles from '/src/styles/images.module.sass'
import {useMemo, useEffect, useState, useReducer} from 'react'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery, useQueries} from 'react-query'
import {formElements, validationSchema} from '/src/cms/data/service/edit'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Service from '/src/cms/data/service/model'


export default function Page({data}){
    return <>
        <CmsEditForm 
            data={data}
            validationSchema={validationSchema}
            cmsTitle={'Service'}
            model_path={'service'} // the folder in cms/data which corresponds to the data in this page
            id_path={'url'} //the path in values to the unique id of this data
            revalidate={['/', ['services','use id']]} //pages to perform on demand isr
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
        data = await Service.find()
            .select(['data'])
            .where('data.url').eq(id)
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

