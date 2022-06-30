import generateModel from '/src/cms/lib/models/gernerateModel';

const model_name = 'HomeLandingSlides'
const reorder_paths = ['order']
const data = {
	"enabled": {type: Boolean},
	"order": {type: Number, min: 0},
	"title": {type: String},
	"desc": {type: String},
	"img": {
		"url": {type: String},
		"alt": {type: String},
	}
}

const model = generateModel(model_name, reorder_paths, data)
export default model



