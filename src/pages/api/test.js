import clientPromise from '/src/lib/api/db/mongo_connect'



export default async function handler(req, res) {
    console.log('uwu')
    try {
        const con = await clientPromise    
        res.status(200).json({ message: "connected to mongo dbb uqu" })
    } 
    catch (e) {
        console.error(e)
        res.status(400).json({ message: e })
    }
}