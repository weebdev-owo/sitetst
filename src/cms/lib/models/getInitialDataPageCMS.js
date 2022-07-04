import {getByPath} from '/src/cms/lib/utils/byPath'
export default async function getInitialData(section_name, model_path, conditions=null, selections=null , order=null, reformat=null){
    const model = (await import(/* webpackIgnore: false */ /* webpackPreload: true */ /* webpackMode: "eager" */ `/src/cms/data/${model_path}/model`)).default
    // let data_query = new mongoose.Query().find()
    let data_query = model.find().where('data.sectionPageCMS').eq(section_name)
    if(selections) data_query = data_query.select(selections.map(selection => `data.${selection}`))
    if(conditions){
        for (const condition of conditions){
            if (condition.length === 3)data_query = data_query.where(`data.${condition[0]}`)[condition[1]](condition[2])
            else data_query = data_query.where(`data.${condition[0]}`).eq(condition[1])
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
    // console.log(raw_data)
    let new_data = false
    //use carefully will overide confilicting names resulting in bad data if conflicting names exist
    if (reformat === 'remap'){
        new_data = []
        for (const elem of raw_data){
            const elem_data = {}
            for (const selection of selections){
                const item = getByPath(elem.data, selection)
                if (typeof item === 'object' && !Array.isArray(item)) Object.assign(elem_data, item)
                else elem_data[selection.split('.').pop()] = item
            }
            new_data.push(elem_data)
        }
        new_data = JSON.parse(JSON.stringify(new_data))

    }
    return new_data || raw_data
}