import dbConnectCms from '/src/cms/lib/api/mongoose_connect'
import process_errors from '/src/cms/lib/api/process_errors'
import revalidate from '/src/cms/lib/api/revalidate'
import validate_data from '/src/cms/lib/api/validate_data'
import does_id_exist from '/src/cms/lib/api/does_id_exist'
import create_document from '/src/cms/lib/api/create_document'

export default async function handler (req, res) {
    const { data, newId, idPath, modelPath, validationPath, revalidatePaths } = req.body

    //get model and validation schema
    const model = (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/cms/data/models/${modelPath}`)).default
    const modelValidationSchema = (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/pages/admin/${validationPath}`)).createValidationSchema

    try {
        await validate_data(data, modelValidationSchema)
        await dbConnectCms()
        const newDocument = await create_document(model, data, newId, idPath)
        const revalidationErrors = await revalidate(res, revalidatePaths)
        console.log('REVE', revalidationErrors)
        res.status(200).json({ 
            success: true, 
            data: newDocument,
            isr_errors: revalidationErrors
        })
    } 
    catch (error) {
        console.log('ERERERERE', error)
        res.status(400).json(process_errors(error))
    }
    
}