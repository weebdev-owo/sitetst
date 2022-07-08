import mongoose from 'mongoose'
import formated_error from '/src/cms/lib//api/formated_error'

export default async function update_document(new_data, model, initialId, newId){
    const id_not_uid = newId !== ''
    const doc = id_not_uid ? await model.findOne({"uid": initialId}) : await model.findOne()
    if (!doc) throw formated_error('db', `a documnet with the unique id [ ${initialId} ] could not be found, try again or create one.`)
    doc.data = new_data
    if (id_not_uid) doc.uid = newId
    const new_doc = await doc.save({ validateBeforeSave: false })    
    return new_doc
}
