import formated_error from '/src/cms/lib/api/formated_error'

export default async function does_id_exist(model, initialId, newId, idPath){
    if(idPath.split('.').pop() === 'order'){return }
    if(initialId === newId){return }

    //check if newId (unique) already belongs to another document in the collection
    const documents = await model.find()
        .select([`uid`])
        .where(`uid`).eq(newId)
    console.log('REEE', documents)
    if (!documents.length){return }
    if(documents[0]['uid'] !== initialId){
        throw formated_error('Validation', `the unique id [ ${newId} ] already belongs to another document. Change the new unique id of this document or the one of the other document which already exists and try again.`)
    }
} 