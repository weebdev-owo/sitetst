import dbConnectCms from '/src/cms/lib/api/mongoose_connect'
import process_errors from '/src/cms/lib/api/process_errors'
import revalidate from '/src/cms/lib/api/revalidate'
import validate_data from '/src/cms/lib/api/validate_data'
import does_id_exist from '/src/cms/lib/api/does_id_exist'
import update_document from '/src/cms/lib/api/update_document'

export default async function handler (req, res) {

    const { data, initialId, newId, idPath, cmsFilePath, revalidatePaths, pageCms } = req.body
    console.log('DATATAAA', data)
    const cms = await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ 
        `/src/cms/data/${cmsFilePath}`
    )
    const model = await cms.model
    const validationSchema = await cms.createValidationSchema

    try {
        const parsed_data = await validate_data(data, validationSchema)
        console.log(parsed_data)
        await dbConnectCms()
        await does_id_exist(model, initialId, newId, idPath)
        const updatedDocument = await update_document(parsed_data, model, initialId, newId)
        const revalidationErrors = await revalidate(res, revalidatePaths)
        res.status(200).json({ 
            success: true, 
            data: updatedDocument,
            isr_errors: revalidationErrors
        })
    } 
    catch (error) {
        console.log('errors', error)
        res.status(400).json(process_errors(error))
    }
    
}