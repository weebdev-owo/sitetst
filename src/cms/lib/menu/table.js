//frontend
import {useState, useRef, useMemo, useEffect} from 'react'
import styles from './menu.module.sass'
// import {SetBgInv} from '/src/lib/utils/setbg'
import Link from 'next/link'
import {QueryClient, QueryClientProvider as QueryProvider, useQuery} from 'react-query'
import axios from 'axios'

const getByPath = (obj, path) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}
// const layout = [
//     // ['title', 'path'],
//     ['Url Name', 'url'],
//     ['Order', 'services.tile.order'],
//     ['Enabled', 'enabled'],
//     ['Booking', 'booking'],
// ]

// const options = {
//     'model_path': 'service',
//     'id_path': 'url',
//     'edit': ['/admin', '/service', '/edit/', 'use id'],
//     'view': ['/services/', 'use id'],
//     'order': 'services.tile.order',
// }

function Table({layout, options}){

    //Change body background and scroll when ref onscreen
    const dataClient = new QueryClient({
        defaultOptions: {
            queries:{
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    })

    return <>
        <QueryProvider client={dataClient}>
            <div className={styles['table-cont']}>
                <Inner layout={layout} options={options}/>
            </div>
        </QueryProvider>
    </>
}

//url, enabled, booking
function Inner({layout, options}){

    const [contents, setContents] = useState(false)
    const {data, refetch, isLoading, isError, error} = useQuery('table', ()=>getTableData(layout, options), {
        onSuccess: (data) => {
            // console.log(data.data.data)
            setContents(formatTableData(data.data.data, layout, options))
        }
    })
    const refresh = useMemo(()=> <>
        <div className={styles['table-msg']}>
            {options.title ? <div className={styles['table-title']}>{options.title}</div>:<></>}
            <div className={styles['refresh']} onClick={refetch}>{`Refresh \u21bb`}</div>
        </div>
    </>
    , [refetch, options.title])
    const titles = useMemo(() => layout.map((item, i) =><div className={styles['table-top-item']} key={i}>{item[0]}</div>), [layout])


    if (isError) {console.log('err', error); return <>{refresh}<div className={styles['table-msg']}>ERROR FETCHING DATA</div></>}
    if (isLoading) return <div className={styles['table-msg']}>LOADING</div>
    if(!contents?.length) return <>{refresh}<div className={styles['table-msg']}>EMPTY</div></>
    const style = data.data.data.length ? {'grid-template-columns': `${'auto '.repeat(contents[0].length)}`}:{}
    return <>
        {refresh}
        <div className={styles['table']} style={style}>
            {titles}
            <div className={styles['table-top-item']}>Edit</div>
            <div className={styles['table-top-item']}>View</div>
            {contents}
        </div>        
    </>
}

function Tick(){
    return <>
        <div className={styles['table-item']+' '+styles['tick']}>✔</div>
    </>
}

function Cross(){
    return <>
        <div className={styles['table-item']+' '+styles['cross']}>✗</div>
    </>
}

function getTableData(layout, options){
    return axios.post(
        '/api/dbQuery', 
        JSON.stringify({layout, options}), 
        {headers: {'Content-Type': 'application/json'}}
    )
 }

function formatTableData(data, layout, options){
    const id_path = `data.${options.id_path}`
    try{
        // console.log(data)
        const new_data =  data.map((item) =>{
            const row = layout.map(([title, path], i)=>{
                return createTableItem(getByPath(item, `data.${path}`))
            })
            const edit = <Link href={createUrl(item, id_path, options.edit)}><a className={styles['table-item']}>✎</a></Link>  
            const view = <Link href={createUrl(item, id_path, options.view)}><a className={styles['table-view']}>→</a></Link>    
            row.push(edit)
            row.push(view)
            console.log(row)
            return row
        })
        // console.log(new_data)
        return new_data
    }
    catch (error){
        console.log('error formating data', error)
        return false
    }

}

function createTableItem(val){
    if (typeof val === 'boolean') return val ? <Tick />:<Cross />
    return <div className={styles['table-item']} >{val}</div>
}

function createUrl(obj, id_path, link){
    return link.map(entry => (entry==='use id' ? getByPath(obj, id_path):entry)).join('')
}

export default Table