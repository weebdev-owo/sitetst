export default async function getPathData(model_path, conditions=null){

    const model = await (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/cms/data/collections/${model_path}`)).model
    let data_query = model.find().select(['uid'])
    
    if(conditions){
        for (const condition of conditions){
            const condition_path = condition[0] !== 'uid' ? `data.${condition[0]}`:'uid'
            if (condition.length === 3)data_query = data_query.where(condition_path)[condition[1]](condition[2])
            else data_query = data_query.where(condition_path).eq(condition[1])
        }
    }

    let docs = await data_query
    const paths = docs.map(doc => ({params: {'id': doc['uid']}}))
    return JSON.parse(JSON.stringify(paths))
    
}