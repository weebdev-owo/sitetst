import mongoose from 'mongoose'
export const pageCmsId = (model_name) => ({
    type: String, 
    minLength: 1,
    maxLength: 100,
    validate: {
        validator: async name => {return !(await mongoose.models[model_name].countDocuments({'data.pageCmsId': name}))},
        message: err => `A Page section with the name name [ ${err.value} ] already exists, the page section name must be unique. \n This means a fetch from the database failed on page load, check server/db configurations and status, or reload this page`,
        reason: 'Validation'
    },
})

export default pageCmsId