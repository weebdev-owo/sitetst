import dbConnectCms, {mongoose} from '/src/cms/lib/api/mongoose_connect'
import process_errors from '/src/cms/lib/api/process_errors'
import revalidate from '/src/cms/lib/api/revalidate'


const getByPath = (obj, path) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}

function createByPath(obj, path, val){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((key) =>{
        if(Object.hasOwn(res, key)){res = res[key]}
        else{
            if(parseInt(key)){res[key] = []}
            else{res[key] = {}}
            res = res[key]
        }
    })
    res[final] = val
}

async function check_url_ids(res, model, model_path, initialId, newId, path){
    try {
        const data = await model.find()
            .select([`data.${path}`])
            .where(`data.${path}`).eq(newId)
        if (!data.length){return true}
        const url_in_db = getByPath(data[0].data, path)
        if(url_in_db !== initialId){
            const formated_error = {
                errors: [
                    {properties: 
                        {
                            reason: 'Validation', 
                            message: `the unique id [ ${newId} ] already belongs to another ${model_path}. Change the unique id of this ${model_path} or the one which already exists and try again.`
                        }
                    }
                ]
            }
            res.status(400).json(process_errors(formated_error))
            return false
        }
        return true
    } 
    catch (error) {
        console.log('inside check url ids error', error)
    }
}

async function update_initial_doc(res, new_data, model, model_path, initialId, path){
    const data_path = `data.${path}`
    const find_initial = new mongoose.Query().find().where(data_path).eq(initialId)
    const updated_doc = await model.findOneAndUpdate(find_initial, {data: new_data}, {new: true})
    if (!updated_doc){
        const formated_error = {
            errors: [
                {properties: 
                    {
                        reason: 'db', 
                        message: `a ${model_path} with the unique id [ ${initialId} ] could not be found, try again or create one.`
                    }
                }
            ]
        }
        res.status(400).json(process_errors(formated_error))
        return false
    }
    return updated_doc
}

export default async function handler (req, res) {
    //data
    const data = req.body.data
    const model_path = req.body.model_path
    const revalidate_paths = req.body.revalidate
    const url_id_path = req.body.url_ids.path
    const initial_url_id = req.body.url_ids.initial
    const new_url_id = getByPath(data, url_id_path)
    console.log('urls')
    console.log('intiial: ', initial_url_id)
    console.log('new: ', new_url_id)


    //get model and validation schema
    const model = (await import(`/src/cms/data/${model_path}/model`)).default
    const modelValidationSchema = (await import(`/src/cms/data/${model_path}/edit`)).validationSchema

    //validate request data
    let valid = false
    try{
        const validated_data = await modelValidationSchema.validate(data, {strict: false})
        valid = true
    }
    catch (error) {
        valid = false
        const formated_error = {
            errors: [
                {properties: {reason: 'Validation', message: `${error.path}: ${error.errors}`}}
            ]
        }
        res.status(400).json(process_errors(formated_error))
    }

    //create in database
    if(valid){
        try {
            const connection = await dbConnectCms()
            const valid_url_id = await check_url_ids(res, model, model_path, initial_url_id, new_url_id, url_id_path)
            if(!valid_url_id){ return }
            const updated_doc = await update_initial_doc(res, data, model, model_path, initial_url_id, url_id_path)
            if(!updated_doc){ return }
            const revalidation_errors = await revalidate(res, revalidate_paths)
            res.status(200).json({ 
                success: true, 
                data: updated_doc,
                isr_errors: revalidation_errors
            })
        } 
        catch (error) {
            console.log(error)
            res.status(400).json(process_errors(error))
        }
    }
}