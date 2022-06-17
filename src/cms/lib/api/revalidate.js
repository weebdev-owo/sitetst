export default async function revalidate(res, paths){
    const revalidation_errors = await  Promise.allSettled(paths.map(async(path) =>{
        try{ await res.unstable_revalidate(path); return false }
        catch(err){ return path }
    }))
    const errors = []
    revalidation_errors.forEach(result =>{
        if(result.value){errors.push(result.value)}
    })
    return errors
}