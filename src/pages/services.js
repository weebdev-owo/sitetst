//backend
import dbConnect from '/src/cms/lib/api/mongoose_connect'
import getInitialData from '/src/cms/lib/models/getInitialData'

function Page({services}){
    console.log(services)
    return <>
    
    </>
}

export default Page

export async function getStaticProps(){
    try {
        const connection = await dbConnect()
        return { props: {
            services: await getInitialData('service', [['enabled', true]], ['url', 'services.tile'], ['services.tile.order'])
        }}
    } 
    catch (error) {console.log('inside static props error', error); return {notFound: true}}
}