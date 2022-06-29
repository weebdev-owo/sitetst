export const getByPath = (obj, path) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach(entry =>{res = res[entry]})
    return res
}

export const setByPath = (obj, path, val) => {
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((entry) =>{res = res[entry]})
    res[final] = val
}

export function createByPath(obj, path, val){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((key) =>{
        if(Object.hasOwn(res, key)){res = res[key]}
        else{
            if(parseInt(key)){res[key] = []}
            else{res[key] = {}}
            res = res[key]
        }
    })
    res[final] = val
}

export function getYup(schema, key){
    if (Object.hasOwn(schema, 'fields')){ return schema['fields'][key]}
    return schema
}

export function setYup(schema, key, val){
    schema['fields'][key] = val
    schema['_nodes'].push(key)
}

export function getYupByPath(obj, path){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    path.forEach((key) =>{
        if(Object.hasOwn(res['fields'], key)){res = getYup(res, key)}
    })
    return res
}

export function setYupByPath(obj, path, val){
    if (typeof path==='string'){path = path.split(".")}
    let res = obj
    const final = path.pop()
    path.forEach((key) =>{
        if(Object.hasOwn(res['fields'], key)){res = getYup(res, key)}
        else{
            if(parseInt(key)){setYup(res, key, Yup.array())}
            else{setYup(res, key, Yup.object().shape({}))}
            res = getYup(res, key)
        }
    })
    setYup(res, final, val)
}