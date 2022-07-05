import dbConnectCms from '/src/cms/lib/api/mongoose_connect'
import process_errors from '/src/cms/lib/api/process_errors'
import revalidate from '/src/cms/lib/api/revalidate'

const getByPath = (obj, path) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}

export default async function handler (req, res) {
    //data
    const layout = req.body.layout
    const options = req.body.options
    const model_path = req.body.options.model_path
    const model = await (await import(`/src/cms/data/models/${model_path}`)).default
    console.log('DATA', layout, options, model)

    //get from db
    try {
        const connection = await dbConnectCms()
        const order = options.order
        const table_data = await getTableData(model, layout, order)
        // const formated_data = formatTableData(table_data, layout, options)
        // console.log(formated_data)
        res.status(200).json({ 
            success: true, 
            data: table_data,
        })
    } 
    catch (error) {
        console.log(error)
        // res.status(400).json(process_errors(error))
    }
    
}

async function getTableData(model, layout, order) {
    try {
        const select_fields = layout.map(item => `data.${item[1]}`)
        console.log('ORDERRRRRR', order)
        if (order){
            const sort_by = {}
            sort_by[`data.${order}`] = 1
            return await model.find().select(select_fields).sort(sort_by)
        }
        else {
            return await model.find().select(select_fields)
        }
    } 
    catch (error) {
        console.log('db query error', error)
        return false
    }
}

