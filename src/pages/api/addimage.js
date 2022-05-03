let fs = require('fs')
let formidable = require('formidable')
let bp = require('body-parser')
let cloudinary = require('cloudinary').v2
let Yup = require('yup')

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp']
const filenameSchema = Yup.string()
    .max(20,'max len 20 chars')
    .matches(/^(?![0-9]*$)[a-zA-Z0-9]+$/, "only letters or numbers allowed")
    .matches(/^[A-Za-z].*/, "file name should not start with special characters")
    .matches(/^[^\\/:\*\?"<>\|]+$/,' forbidden characters \ / : * ? " < > |')
    .matches(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!aux$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/, 'forbidden file name')
    .required("required")

export const config = {
    api: {
        bodyParser: false
    }
}

// export const config = {
//     api: {
//         bodyParser: {
//             sizeLimit:'100mb'
//         }
//     }
// }
const process_file = async () => {

}
export default async function handler(req, res) {
    if (req.method === 'POST') {
        let form = new formidable.IncomingForm({
            uploadDir: `./public/uploads/temp/`,
            keepExtensions: true,
            maxFields: 1,
            multiples: false,
        })
        let valid_filename = false
        // console.log(form)
        form.on('field', (name, field) =>{

            //only allow field filename
            if (name === 'filename'){
                // validate field filename
                field = field + ' rreerere'
                try{
                    valid_filename = filenameSchema.validate(field)
                }
                catch (error){
                    form._error('invalid format field filename')
                    throw error
                }
            }
            else{
                form._error('invalid fields')
                throw error
            }
        });

        // console.log(form)
        form.on('fileBegin', (name, file) =>{
            //check if filename has been processed (if not then throw err and stop)
            console.log(valid_filename)

            // validate file
            if (!SUPPORTED_FORMATS.includes(file.mimetype)){
                form._error('invalid file format')
                throw error
            }
        });
    
        form.on('file', (name, file) =>{
            console.log('stored: ' + file.newFilename + ' in /public/uploads/temp');
        });

        form.parse(req, async(err, fields, files) => {
            console.log(valid_filename)
            //field validation errors
            if(err=='invalid fields'){
                console.log('invalid field(s)')
                return res.status(400).json({
                    status: 'Fail',
                    message: "invalid field(s)",
                    error: err
                })
            }

            if(err=='invalid format field filename'){
                console.log('invalid field filename')
                return res.status(400).json({
                    status: 'Fail',
                    message: "the field filename must be of correct format",
                    error: err
                })
            }

            //file validation errors
            if(err=='invalid file format'){
                console.log('invalid file type')
                return res.status(400).json({
                    status: 'Fail',
                    message: "file must be jpg, jpeg or png",
                    error: err
                })
            }

            //parser error
            if(err){
                console.log('error parsing files', err)
                return res.status(400).json({
                    status: 'Fail',
                    message: "error parsing files",
                    error: err
                })
            }
            

            //rename file to field param
            const file = files.image
            const filename = fields.filename + '.' + file.mimetype.substring(6)
            const filepath =  form.uploadDir + `\\` + filename
            try{
                fs.rename(file.filepath+'\\'+'ree'+'\\', filepath, (err)=>{if(err){console.log(err)}})
            }
            catch (error){
                console.log("could not rename file to supplied name", error)
                return res.status(400).json({
                    status: 'Fail',
                    message: "could not rename file to supplied name",
                    error: error
                })
            }
            
            //upload to cloudinary
            try{
                const temp = await cloudinary.uploader.upload(filepath, {
                    resource_type: "image",
                    public_id: cloudinary_path
                })
                console.log("uploaded :3?", temp)
            }
            catch (error){
                console.log('upload to cloudinary failed', error)
                return res.status(400).json({
                    status: 'Fail',
                    message: 'upload to cloudinary failed',
                    error: error
                })
            }




            //store compressed and named image (from cloudinary)
            //delete temp image
            //return response to client
            
        })

        // res.status(200).json({ message: 'uploaded file uwu' })
    } 
    else {
        res.status(400).json({ message: 'error must send POST request' })
    }
}

