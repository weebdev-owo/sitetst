import dbConnect from '/src/lib/api/db/mongoose_connect'
import Service from '/src/lib/api/db/models/service'

export default async function handler (req, res) {
    await dbConnect()
    try {
        const service = await Service.create({
            // title: 'omnom',
            tst: 33,
            "service-tile": {
                order: 10,
                name: 'test namu3',
                desc: "ree",
                img: "/tree.png",
                alt: "inai",
                link: "/services",
            },
        })
        const services = await Service.find()
        res.status(200).json({ success: true, data: services })
    } 
    catch (error) {
        res.status(400).json({ error })
    }
}