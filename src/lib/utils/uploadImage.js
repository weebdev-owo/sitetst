export default async function uploadImage(image){
    console.log('submit', image.size)
    try{
        const res = await axios.post('http://localhost:3000/api/uploadimage', values, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
        console.log(res.data)
    }
    catch (e){
        console.log(e)
    }
}