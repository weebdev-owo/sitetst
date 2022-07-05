export default async function create_document(model, data, newId, idPath){
    const isOrder = idPath.split('.').pop() === 'order'
    const doc = new model({ uid: newId, data: data })
    return await doc.save({ validateBeforeSave: !isOrder })
    return doc
}