import dbConnectCms from '/src/cms/lib/api/mongoose_connect'
import process_errors from '/src/cms/lib/api/process_errors'
import revalidate from '/src/cms/lib/api/revalidate'
import validate_data from '/src/cms/lib/api/validate_data'
import does_id_exist from '/src/cms/lib/api/does_id_exist'
import create_document from '/src/cms/lib/api/create_document'

export default async function handler (req, res) {

    const { data, newId, idPath, cmsFilePath, revalidatePaths, pageCms } = req.body

    const cms = await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ 
        `/src/cms/data/${cmsFilePath}`
    )
    const model = await cms.model
    const validationSchema = await cms.createValidationSchema

    try {
        await validate_data(data, validationSchema)
        await dbConnectCms()
        const newDocument = await create_document(model, data, newId, idPath)
        const revalidationErrors = await revalidate(res, revalidatePaths)
        res.status(200).json({ 
            success: true, 
            data: newDocument,
            isr_errors: revalidationErrors
        })

    } 
    catch (error) {
        console.log('CMS create error', error)
        res.status(400).json(process_errors(error))
    }
    
}