import { getByPath, setByPath } from '/src/cms/lib/utils/byPath'
import get_imgs from '/src/cms/lib/utils/get_imgs'

export default function createPayload(values){
    const payload = JSON.parse(JSON.stringify(values))
    const paths = get_imgs(payload, [], [])
    for (const path of paths){
        const img = getByPath(values, path)
        setByPath(payload, path, {
            url: img['url'],
            alt: img['alt']
        })
    }
    return payload
}