function Page({intro}){
    console.log(intro)
    return <>
        TopBar


    </>
}

import dbConnect from '/src/cms/lib/api/mongoose_connect'
import getInitialData from '/src/cms/lib/models/getInitialData'
export async function getStaticProps(){
    try {
        const connection = await dbConnect()
        const intro = await getInitialData('pageCms/services-page/intro')
        return {
            props: {
                intro: JSON.parse(JSON.stringify(intro[0].data))
            }
        }
    } 
    catch (error) {console.log('inside static props error', error); return {notFound: true}}
}

export default Page