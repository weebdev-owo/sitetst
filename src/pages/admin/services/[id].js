import Create from '/src/comp/admin/services/create'
import styles from '/src/lib//cms/cms.module.sass'
import styles2 from '/src/styles/home.module.sass'
import CmsCreateForm from '/src/lib/cms/cmsCreateForm'
import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/lib/cms/primitives'
import image_styles from '/src/styles/images.module.sass'
import * as Yup from 'yup'
import serviceSchema from '/src/lib/cms/data/validations/service'
import {useMemo, useEffect, useState} from 'react'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery, useQueries} from 'react-query'
import dbConnect from '/src/lib/api/db/mongoose_connect'
import Service from '/src/cms/service/schema'

const queryClient = new QueryClient({
    defaultOptions: {
        queries:{
            // onSucsess: 
            // refetchInterval,
            // refetchIntervalInBackground,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false
        }
    }
})

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

const initialValues3 = {
    "url": "thrh",
    "enabled": true,
    "booking": true,
    "services": {
        "tile": {
            "order": "4",
            "name": "drh",
            "desc": "drgh",
            "img": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        }
    },
    "service": {
        "intro": {
            "name": "drgh",
            "desc": "drh",
            "img": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        },
        "summary": {
            "s1": "drh",
            "s2": "drh",
            "s3": "drh",
            "img1": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            },
            "what": "drh",
            "img2": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            },
            "why": "drh",
            "img3": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        },
        "process": {
            "intro": "drh",
            "steps": [
                {
                    "name": "drh",
                    "desc": "drh",
                    "img": {
                        "original": null,
                        "cropped": null,
                        "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                        "alt": "edit for better seo"
                    }
                }
            ]
        },
        "faq": {
            "intro": "drh",
            "items": [
                {
                    "question": "drh",
                    "answer": "drh"
                },
                {
                    "question": "drg",
                    "answer": "rg"
                }
            ]
        }
    },
    "isEditorOpen": false,
    "editorFileName": "",
    "editorPreviewStyle": null,
    "isSubmitOpen": false
}

async function fetchImg(url){

    const res = await fetch(url)
    return res.blob()
}

export default function EditService2({data}){
    return <>
        <QueryProvider client={queryClient} >
            <EditService data={data} />
        </QueryProvider>
    </>
}

function calc_queries(data){
    // const new_data = JSON.parse(JSON.stringify(data))
    const img_paths = get_imgs(data, [], [])

    return img_paths.map(path =>{
        return {
            queryKey: ['image', path],
            queryFn: () => {
                const img_url = getByPath(data, path)['url']
                return fetchImg(img_url)
            },
            onSuccess: (img_file) =>{
                setByPath(data, path.concat(['original']), img_file)
                setByPath(data, path.concat(['cropped']), img_file)
            }
            

        }
    })
}

function EditService({data}){

    const [initialValues, setInitialValues] = useState(JSON.parse(JSON.stringify(data)))
    const [isLoading, setLoading] = useState(true)
    const imgs = useQueries(calc_queries(initialValues))

    useEffect(() =>{ 
        if (imgs.every(img => img.status === 'success')){setLoading(false); console.log('downloading complete')}
    }, [imgs.every(img => img.status === 'success')])

    if(!isLoading){ return <>
        <div className={styles2.home}>
            {/* <Create /> */}
            <CmsCreateForm 
                initialValues={initialValues} 
                validationSchema={Yup.object({}) || serviceSchema}
                imageUrl={'http://localhost:3000/api/uploadSingleImage'}
                dbUrl={'http://localhost:3000/api/cmsCreate'}
                cmsTitle={'Service'}
            >
                <div className={styles["heading"]}>Create Service</div>

                <div className={styles['page-section']}>
                    <Text name="url" label="name (https://domain/serivices/'name')" />
                    <CheckBox name="enabled" label="enabled (if not enabled service will not appear on website)" />
                    <CheckBox name="booking" label="show in booking form (selectable in booking form services if the service is enabled)" />
                </div>

                <div className={styles["sub-heading"]}>Services Data</div>

                <div className={styles["sub-sub-heading"]}>Service Tile</div>
                <div className={styles['page-section']}>
                    <Text name="services.tile.order" label="order (where the service is placed on services grid)" />
                    <Text name="services.tile.name" label="name" />
                    <TextArea name="services.tile.desc" label="description" />
                    <FormImage name="services.tile.img" label="background image" styleIn={image_styles['service-tile']}/>
                </div>

                <div className={styles["sub-heading"]}>Service Page Data</div>

                <div className={styles["sub-sub-heading"]}>Section 1: intro</div>
                <div className={styles['page-section']}>
                    <Text name="service.intro.name" label="name" />
                    <TextArea name="service.intro.desc" label="description" />
                    <FormImage name="service.intro.img" label="background image" styleIn={image_styles['fullscreen']}/>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 2: summary (dark background)</div>
                <div className={styles['page-section']}>
                    <div className={""}>Statements (part 1)</div>
                    <Text name="service.summary.s1" label="statement1" />
                    <Text name="service.summary.s2" label="statement2" />
                    <Text name="service.summary.s3" label="statement3" />
                    <FormImage name="service.summary.img1" label="statement image (image 1)" styleIn={image_styles['summary-1']}/>
                    <Space />
                    <div className={""}>What (part 2)</div>
                    <TextArea name="service.summary.what" label="text" />
                    <FormImage name="service.summary.img2" label="image (image 2)" styleIn={image_styles['summary-2']}/>
                    <Space />
                    <div className={""}>Why (part 3)</div>
                    <TextArea name="service.summary.why" label="text" />
                    <FormImage name="service.summary.img3" label="image (image 3)" styleIn={image_styles['summary-3']}/>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 3: Our Process</div>
                <div className={styles['page-section']}>
                    <TextArea name="service.process.intro" label="intro" />
                    <List name={"service.process.steps"} item_template={step} item_label={"Step"}>
                        {(i, list_name) => <div>
                            <Text name={`${list_name}.${i}.name`} label={`title`} key={i}/>
                            <TextArea name={`${list_name}.${i}.desc`} label={`description`} key={i}/>
                            <FormImage name={`${list_name}.${i}.img`} label={`image`} styleIn={image_styles['step']} key={i}/>
                        </div> }
                    </List>
                </div>

                <div className={styles["sub-sub-heading"]}>Section 4: Info/Faq</div>
                <div className={styles['page-section']}>
                    <TextArea name="service.faq.intro" label="intro" />
                    <List name={"service.faq.items"} item_template={question} item_label={"Question"}>
                        {(i, list_name) => <div>
                            <Text name={`${list_name}.${i}.question`} i={i} label={`question`} key={i}/>
                            <TextArea name={`${list_name}.${i}.answer`} i={i} label={`answer`} key={i}/>
                        </div>}
                    </List>
                </div>

                <div className={styles["submit-section"]}>
                    <button type="submit" className={styles["submit"]}>Create Service</button>   
                </div>
            </CmsCreateForm>
        </div>
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
        console.log('inside server side props', data[0].data)
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

