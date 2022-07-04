import mongoose from "mongoose";
import reOrder from "/src/cms/lib/utils/reOrder"
import { getByPath } from '/src/cms/lib/utils/byPath';

export default function generateModel(model_name, reorder_paths, data, collection_name="pageCMS"){

    const layout = {
        createdAt: {type: Date, immutable: true, default: () => Date.now()},
        updatedAt: {type: Date, default: () => Date.now()},
        activeDate: {type: Date, default: () => Date.now()},
        section: {type: String},
        data: data
    }
    const Schema = new mongoose.Schema(layout);

    //MIDDLEWARE
    //before save
    Schema.pre('save', async function(next){
        this.updatedAt = Date.now()
        let reorders = true
        for await (const path of reorder_paths){
            const reordered = await reOrder(getByPath(this.data, path), model_name, path)
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

