export default function process_errors(error){

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