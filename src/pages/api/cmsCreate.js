import dbConnectCms from '/src/cms/lib/api/mongoose_connect'
import process_errors from '/src/cms/lib/api/process_errors'
import revalidate from '/src/cms/lib/api/revalidate'

export default async function handler (req, res) {
    //data
    const data = req.body.data
    const model_path = req.body.model_path
    const revalidate_paths = req.body.revalidate
    console.log('DATAAA', data)
    //get model and validation schema
    const model = (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/cms/data/${model_path}/model`)).default
    const modelValidationSchema = (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/cms/data/${model_path}/create`)).validationSchema
    console.log('MODELLLL', model)
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
    if(!valid){ return}
    console.log('uibvbiusdrb')
    // try {
        const connection = await dbConnectCms()
        const item = await model.create({data: data})
        const revalidation_errors = await revalidate(res, revalidate_paths)
        console.log(item)
        res.status(200).json({ 
            success: true, 
            data: item,
            isr_errors: revalidation_errors
        })
    // } 
    // catch (error) {
    //     res.status(400).json(process_errors(error))
    // }
    
}