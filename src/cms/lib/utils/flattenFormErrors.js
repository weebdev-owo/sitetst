const flattenObject = (obj, parentKey = '') => {
    if (parentKey !== '') parentKey += '.';
    let flattened = {};
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if(key.slice(0,3) === 'img' && obj[key].cropped && obj[key].cropped) flattened[parentKey + key] = 'required'
            else Object.assign(flattened, flattenObject(obj[key], parentKey + key))
        } else {
            flattened[parentKey + key] = obj[key]
        }
    })
    // const parsed_flattened = JSON.parse(JSON.stringify(flattened))
    for (const [key, val] of Object.entries(flattened)){
        if (val == null){delete flattened[key]}
    }
    return flattened;
}

export default flattenObject