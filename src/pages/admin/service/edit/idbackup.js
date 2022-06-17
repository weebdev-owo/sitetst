//frontend
import styles from '/src/cms/lib/edit/cms.module.sass'
// import CmsEditForm from '/src/cms/lib/edit/cmsEditForm'
import CmsEditForm from '/src/cms/lib/create/cmsCreateForm'
import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/edit/primitives'
import image_styles from '/src/styles/images.module.sass'
import {useMemo, useEffect, useState, useReducer} from 'react'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery, useQueries} from 'react-query'
import {formElements, validationSchema} from '/src/cms/data/service/edit'
//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import Service from '/src/cms/data/service/model'


const isImg = new RegExp('^img', 'i')
function get_imgs(data, path, paths){  
    if (typeof data === 'object' && data != null){
        if (Array.isArray(data)){   //array
            for(let i=0; i<data.length; i++){
                get_imgs(data[i], path.concat([i]), paths)
            }
        }
        else {  
            const keys = Object.keys(data) //object
            for (let i=0; i<keys.length; i++){
                if (isImg.test(keys[i])){paths.push(path.concat([keys[i]]))}
                else {get_imgs(data[keys[i]], path.concat([keys[i]]), paths)}
            }
        }
    }
    return paths
}
const getByPath = (obj, path) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}
const setByPath = (obj, path, val) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((entry) =>{res = res[entry]})
    res[final] = val
}
const img = {
    "original": null,
    "cropped": null,
    "url": "",
    "alt": "edit for better seo"
}
const step = {
    "name": "",           
    "desc": "",
    "img": img,
}
const question = {
    "question": "",           
    "answer": "",
}

async function fetchImg(url){

    const res = await fetch(url)
    return res.blob()
}

export default function EditService2({data}){
    console.log('FETCHED DATA')
    const [queryClient, setQueryClient] = useState(new QueryClient({
        defaultOptions: {
            queries:{
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    }))

    return <>
        <QueryProvider client={queryClient} >
            <EditService data={data} />
        </QueryProvider>
    </>
}

function calc_queries(data, updateImg){
    const img_paths = get_imgs(data, [], [])

    return img_paths.map(path =>{
        return {
            queryKey: ['image', path],
            queryFn: () => {
                const img_url = getByPath(data, path)['url']
                return fetchImg(img_url)
            },
            onSuccess: (img_file) => {updateImg([path, img_file])},
            onError: () => {updateImg([path, null])}
        }
    })
}

function intialValuesReducer(state, [path, value]){
    setByPath(state, path.concat(['original']), value)
    setByPath(state, path.concat(['cropped']), value)
    // console.log(state, path, value)
    return {...state}
}

function EditService({data}){
    const [initialValues, setInitialValues] = useReducer(intialValuesReducer, JSON.parse(JSON.stringify(data)))
    const [imgLoadComplete, setImgLoadComplete] = useState(false)
    const imgs = useQueries(calc_queries(initialValues, setInitialValues))

    useEffect(() =>{ 
        if (imgs.every(img => (img.status === 'success' ||  img.status === 'error'))){setImgLoadComplete(true)}
    }, [initialValues])

    if(imgLoadComplete){ return <>
        <CmsEditForm 
            initialValues={initialValues} 
            validationSchema={validationSchema}
            cmsTitle={'Service'}
            model_path={'service'}
            id_path={'url'}
            revalidate={['/', ['services','use id']]}
        >
            {formElements}
        </CmsEditForm>

    </>}
    else{ return <>
        LOADING IMAGES
    </>}
    
}

export async function getServerSideProps(context){
    const id = context.params.id
    let services = []
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

