export default function Page({context}){
    console.log(context)
    return <>
        PAGE DATA
    </>
}

export async function getServerSideProps(context){
    return {
        props: {
            context: JSON.parse(JSON.stringify(context.params))
        }
    }
}