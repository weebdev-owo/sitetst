const fs = require('fs')
const asyncParse = require('/src/lib/form/asyncParse')
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
            console.log('STARTING UPLOAD')

            //create temp directory and setup tempDir cleanup
            let tempDir = tmp.dirSync({unsafeCleanup: true})
            res.on('finish', () => {tempDir.removeCallback()})
            res.on('error', () => {tempDir.removeCallback()})

            //PARSE form data and store file in tempDir
            let formData = await asyncParse(req, {
                uploadDir: tempDir.name, 
                keepExtensions: true, 
                maxFields: 0, 
                multiples: true, 
                maxFieldsSize: 1, 
                maxFileSize: 10*mb,
            })
            .catch((error) => {error_message = "Parser Error, Image might be to large for web"; next(error)})
            const {fields, files} = formData; 
            const file = files.image; 
            
            const filename = files.newFilename

            const public_id = `${process.env.CLOUDINARY_UPLOAD_FOLDER}/${filename}`

            //VALIDATE formData and paths
            if(!file || Object.keys(fields).length !== 1 || Object.keys(files).length !== 1){ //image and filename supplied and only supplied
                error_message = "invalid form data"; throw "Validation Error"
            }

            if(!SUPPORTED_FORMATS.includes(file.mimetype)){ //check if filetype is valid
                error_message = "filetype invalid"; throw "Validation Error"
            }

            // UPLOAD to cloudinary
            const uploaded_image = await cloudinary.uploader.upload(file.filepath, {
                resource_type: "image",
                public_id: public_id,
                use_filename: false,
                unique_filename: false,
                type: "authenticated",
                eager: [{quality: "auto:eco", format: "jpg"}]
            })
            .catch((error) => {error_message = "upload to cloudinary failed"; next(error)})
            const new_img_url = uploaded_image.eager[0].secure_url

            //DOWNLOAD and STORE compressed image to /public/uploads/
            const new_img_path = `./public/uploads/${filename}.jpg`
            const writeStream = fs.createWriteStream(new_img_path) //setup file writeStream stream
            
            const data = await fetch(new_img_url) //get image data from upload url transformation
            .catch((error) => {error_message = "error geting resource from cloudinary after upload"; next(error)})

            const fileStream = await data.body.pipe(writeStream) //write data to file
            await new Promise((resolve, reject) =>{
                writeStream.on('finish', () => {writeStream.end(); resolve()})
                writeStream.on('error', (error) => {writeStream.end(); reject(error)})
            })
            .catch((error) => {
                try{ fs.unlinkSync(new_img_path) } //delete writeStream file
                catch(error){ console.log(`error cannot find file or dir ${new_img_path} to delete, ${error}`) }
                error_message = `error in stream (saving file) to ./public/uploads/${filename}.jpg`
                next(error) 
            })

            console.log('uploaded :3')
            res.status(200).json({ message: 'uploaded file uwu' })
 
        }
        catch (error){
            if(!error_message){error_message = 'erRor UnAccountED: '}; 
            console.log(error, ' | \n', error_message)
            return res.status(400).json({message: error_message, status: 'Fail', error: error})
        }
    } 
    else { res.status(200).json({ message: 'error must send POST request' }) }
}

