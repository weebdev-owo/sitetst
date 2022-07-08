import generateModel from '/src/cms/lib/models/gernerateModel'
import image_styles from '/src/styles/images.module.sass'

//MODEL
const model_name = 'HomeLandingSlides'
const reorder_paths = ['order']
const data = {
	"enabled": {type: Boolean},
	"order": {type: Number, min: 0, max: 1000000},
	"title": {type: String},
	"desc": {type: String},
	"img": {
		"url": {type: String},
		"alt": {type: String},
	}
}
const model = generateModel(model_name, reorder_paths, data, {
	uid_type: Number,
    uid_order_path: reorder_paths[0], //if uid ia an order reorder it according to which path in reorder paths
})

//FORM
const configs = {
    cmsTitle: 'Landing Slide', 
    pagePath: 'home/landing', 
    idPath: 'order', 
    modelPath: 'home_landing', 
    revalidate: ['/'], 
    viewUrl: (v)=>'/', 
    editUrl: undefined
}
const generate_template = (primitives, setIV, valid) =>{
    const {text, textarea, checkbox, image, list, space} = primitives
    return [
        ['Home Page',
            ['Landing Slide',
                checkbox("enabled", "enabled (if not enabled will not appear on website)", setIV(true), valid.bool()),
                text("order", "order (in the home page landing section carousel)", valid.int(1, 1000)),
                text('title', `title`, valid.text(100)),
                textarea('desc', `description`, valid.text(500)),
                image('img', `carousel image`, image_styles['landing-car']),
            ],
        ]
    ]
} 

export {generate_template, configs, model}
export default model