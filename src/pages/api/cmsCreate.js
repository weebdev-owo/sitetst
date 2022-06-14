import dbConnect from '/src/lib/api/db/mongoose_connect'
import model from '/src/cms/service/model'
import modelValidationSchema from '/src/cms/service/serverValidationSchema'

function process_errors(error){

    const types = { validation: false, server: false}
    const messages = Object.entries(error.errors).map(([key, err]) =>{
        if ( err.properties && err.properties.reason == 'Validation'){types['validation'] = true}
        else{types['server'] = true}
        return err.properties.message
    })

    return { 
        error: {
            types: types,
            messages: messages
        }
    }
}

async function dbConnect2(res){
    try{
        return await dbConnect()
    }
    catch (error){
        throw {
            errors: [
                {properties: {reason: 'ServerConnection', message: error.message}}
            ]
        }
    }
}

async function revalidate(res, paths){
    const revalidation_errors = await  Promise.allSettled(paths.map(async(path) =>{
        try{ await res.unstable_revalidate(path); return false }
        catch(err){ return path }
    }))
    const errors = []
    revalidation_errors.forEach(result =>{
        if(result.value){errors.push(result.value)}
    })
    return errors
}

export default async function handler (req, res) {
    //data
    const data = req.body.data
    const model_path = req.body.model_path
    const revalidate_paths = req.body.revalidate

    //get model and validation schema
    const model = (await import(`/src/cms/${model_path}/model`)).default
    const modelValidationSchema = (await import(`/src/cms/${model_path}/serverValidationSchema`)).default

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
            const connection = await dbConnect2()
            const service = await model.create({data: data})
            const revalidation_errors = await revalidate(res, revalidate_paths)
            res.status(200).json({ 
                success: true, 
                data: service,
                isr_errors: revalidation_errors
            })
        } 
        catch (error) {
            res.status(400).json(process_errors(error))
        }
    }

}