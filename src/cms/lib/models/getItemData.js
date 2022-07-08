import {getByPath} from '/src/cms/lib/utils/byPath'
//await getInitialData('service', [['enabled', true]], ['url', 'services.tile'], ['services.tile.order'], 'remap')
//await getInitialData(model_path, conditions=[['path', value]], selections['selection1', 'selection2'], order=['order.by.this.path'])
export default async function getInitialData(model_path, conditions=null, selections=null , order=null, reformat=null){
    const model = await (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/cms/data/collections/${model_path}`)).model
    // let data_query = new mongoose.Query().find()
    let data_query = model.find()
    if(selections) data_query = data_query.select(selections.map(selection => selection !== 'uid' ? `data.${selection}`:'uid'))
    if(conditions){
        for (const condition of conditions){
            const condition_path = condition[0] !== 'uid' ? `data.${condition[0]}`:'uid'
            if (condition.length === 3)data_query = data_query.where(condition_path)[condition[1]](condition[2])
            else data_query = data_query.where(condition_path).eq(condition[1])
        }
    }
    if(order){
        if (typeof order[0] === 'string'){
            const sorter = {}; sorter[`data.${order[0]}`] = order.length ? order[1]:1
            data_query = data_query.sort(sorter)
        }
        else {
            const sorter = {}; for (const item in order) {sorter[`data.${item[0]}`] = item.length ? item[1]:1}
            data_query = data_query.sort(sorter)
        }
    }
    let raw_data = await data_query

    let new_data = false
    //use carefully will overide confilicting names resulting in bad data if conflicting names exist
    if (reformat === 'remap'){
        new_data = []
        for (const elem of raw_data){
            const elem_data = {}
            for (const selection of selections){
                const item = selection !== 'uid' ? getByPath(elem.data, selection): elem.uid
                if (typeof item === 'object' && !Array.isArray(item)) Object.assign(elem_data, item)
                else elem_data[selection.split('.').pop()] = item
            }
            new_data.push(elem_data)
        }
    }

    let data = new_data || raw_data.length
    if (data.length === 0) data = false
    else if (data?.length === 1) data = data[0]
    return data ? JSON.parse(JSON.stringify(data)):false
}