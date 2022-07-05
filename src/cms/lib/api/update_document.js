import mongoose from 'mongoose'
import formated_error from '/src/cms/lib//api/formated_error'

export default async function update_document(new_data, model, initialId, newId){
    console.log(initialId, newId)
    console.log(model)
    const doc = await model.findOne({"uid": initialId})
    console.log('DOC', doc)
    if (!doc) throw formated_error('db', `a documnet with the unique id [ ${initialId} ] could not be found, try again or create one.`)
    // const doc = await model.where('uid').eq(String(initialId))
    // const doc = docs[0]
    console.log(doc)
    doc.data = new_data
    doc.uid = newId
    const new_doc = await doc.save({ validateBeforeSave: false })
    
    return new_doc
}
