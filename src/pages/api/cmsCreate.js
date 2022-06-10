import dbConnect from '/src/lib/api/db/mongoose_connect'
import Service from '/src/lib/api/db/models/service'
import serviceSchema from '/src/lib/validations/service_server'

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

export default async function handler (req, res) {
    const data = req.body.data
    let valid = false
    try{
        const validated_data = await serviceSchema.validate(data,{
            strict: false
        })
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

    if(valid){
        try {
            const connection = await dbConnect2()
            const service = await Service.create({data: data})
            res.status(200).json({ success: true, data: service })
        } 
        catch (error) {
            res.status(400).json(process_errors(error))
        }
    }

}