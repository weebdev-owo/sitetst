import formated_error from '/src/cms/lib/api/formated_error'

export default async function validate_data(data, validationSchema){
    //validate request data
    try{
        const validated_data = await validationSchema.validate(data, {strict: false})
        return validated_data
    }
    catch (error) {
        throw formated_error('Validation', `${error.path}: ${error.errors}`)
    }
    
}
