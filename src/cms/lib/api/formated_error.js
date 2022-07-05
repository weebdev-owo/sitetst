export default function formated_error(reason, message){
    return {
        errors: [
            {properties: 
                {
                    reason: reason, 
                    message: message
                }
            }
        ]
    }
}