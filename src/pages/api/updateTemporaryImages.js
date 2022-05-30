const fs = require('fs')
const asyncParse = require('/src/lib/api/form/asyncParse')
const cloudinary = require('cloudinary').v2
const Yup = require('yup')
const tmp = require('tmp')

//config
export const config = {api: {bodyParser: false}}
let error_message
const b = 8
const kb = 1000
const mb = 1000*kb

//setup cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

//validation requirements
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try{
            console.log('STARTING RENAME')

            //create temp directory and setup tempDir cleanup
            let tempDir = tmp.dirSync({unsafeCleanup: true})
            res.on('finish', () => {tempDir.removeCallback()})
            res.on('error', () => {tempDir.removeCallback()})

            //PARSE form data and store file in tempDir
            let formData = await asyncParse(req, {
                uploadDir: tempDir.name, 
                keepExtensions: true, 
                maxFields: 0, 
                multiples: false, 
                maxFieldsSize: 1, 
                maxFileSize: 10*mb,
            })
            .catch((error) => {error_message = "Parser Error, Image might be to large for web"; next(error)})
            const {fields, files} = formData; 
            const file = files.image; 
            console.log(file)
            const filename = 'uwu'

            const public_id = `${process.env.CLOUDINARY_UPLOAD_FOLDER}/${filename}`

            //VALIDATE formData
            if(!file || Object.keys(fields).length || Object.keys(files).length !== 1){ //a single image supplied and only supplied
                error_message = "invalid form data"; throw "Validation Error"
            }

            if(!SUPPORTED_FORMATS.includes(file.mimetype)){ //check if filetype is valid
                error_message = "filetype invalid"; throw "Validation Error"
            }

            // UPLOAD to cloudinary
            const uploaded_image = await cloudinary.uploader.upload(file.filepath, {
                resource_type: "image",
                // public_id: public_id,
                folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
                use_filename: true,
                unique_filename: true,
                type: "authenticated",
                eager: [{quality: "auto:eco", format: "jpg"}]
            })
            .catch((error) => {error_message = "upload to cloudinary failed"; next(error)})

            const new_img_url = uploaded_image.eager[0].secure_url
            console.log('uploaded :3')
            res.status(200).json({ message: 'uploaded file uwu', url: new_img_url })
 
        }
        catch (error){
            if(!error_message){error_message = 'erRor UnAccountED: '}; 
            console.log(error, ' | \n', error_message)
            return res.status(400).json({message: error_message, status: 'Fail', error: error})
        }
    } 
    else { res.status(400).json({ message: 'error must send POST request' }) }
}

