import mongoose from "mongoose";
import reOrder from "/src/cms/lib/utils/reOrder"
import { getByPath } from '/src/cms/lib/utils/byPath';

export default function generateModel(model_name, reorder_paths, data, options ){

    const {uid_type, uid_is_order, uid_default, collection_name} = options ?? {}
    console.log(options, options?.uid_type, options?.uid_is_order, options?.uid_default, options?.collection_name)
    const layout = {
        createdAt: {type: Date, immutable: true, default: () => Date.now()},
        updatedAt: {type: Date, default: () => Date.now()},
        activeDate: {type: Date, default: () => Date.now()},
        uid: {
            type: uid_type ? uid_type:mongoose.Schema.Types.Mixed, 
            default: uid_default,
            validate: {
                validator: async uid => {return !(await mongoose.models[model_name].countDocuments({'uid': uid}))},
                message: err => `A ${model_name} with the unique id [ ${err.value} ] already exists. \n. Change the id of this document or the one which already exists and try again`,
                reason: 'Validation'
            },
        },
        data: data
    }
    const Schema = new mongoose.Schema(layout);

    //MIDDLEWARE
    //before save
    Schema.pre('save', async function(next){
        this.updatedAt = Date.now()
        let reorders = true
        for await (const path of reorder_paths){
            const reordered = await reOrder(getByPath(this.data, path), model_name, path, {uid_is_order: uid_is_order})
            reorders &&= reordered
            if (!reordered){
                const error = {
                    errors: [
                        {properties: 
                            {
                                reason: 'db', 
                                message: `a ${model_name} with the unique id [ ${this._id} ] and order [ ${getByPath(this.data, path)} ] failed to trigger all reorder paths ${reorder_paths}. Try again, or check server/database configurations.`
                            }
                        }
                    ]
                }
                next(error)
                break
            }
        }
        if(reorders){next()}
    })


    //after save
    Schema.post('save', function(document, next){
        if(document){console.log(`saved ${model_name}`)}
        else{console.log(`something went wrong saving ${model_name}`)}
        next()
    })

    return mongoose.models?.[model_name] || mongoose.model(model_name, Schema, collection_name);
}

