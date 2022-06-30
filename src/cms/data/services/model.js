import generateModel from '/src/cms/lib/models/gernerateModel';
import mongoose from 'mongoose';

const model_name = 'Service'
const reorder_paths = ['services.tile.order']
const data = {
	"url": {
		type: String, 
		minLength: 1,
		maxLength: 100,
		validate: {
			validator: async name => {return !(await mongoose.models[model_name].countDocuments({'data.url': name}))},
			message: err => `A service with the url name [ ${err.value} ] already exists, the url name of a service must be unique. \n Change the url name and try again`,
			reason: 'Validation'
		},
	},
	"enabled":{type: Boolean},
	"booking": {type: Boolean},
	"services": {
		"tile": {
			"order": {type: Number, min: 0},
			"name": {type: String},
			"desc": {type: String},
			"img": {
				"url": {type: String},
				"alt": {type: String},
			}
		}
	},
	"service": {
		"intro": {
			"name": {type: String},
			"desc": {type: String},
			"img": {
				"url": {type: String},
				"alt": {type: String},
			}
		},
		"summary": {
			"s1": {type: String},
			"s2": {type: String},
			"s3": {type: String},
			"img1": {
				"url": {type: String},
				"alt": {type: String},
			},
			"what": {type: String},
			"img2": {
				"url": {type: String},
				"alt": {type: String},
			},
			"why": {type: String},
			"img3": {
				"url": {type: String},
				"alt": {type: String},
			}
		},
		"process": {
			"intro": {type: String},
			"steps": [
				{
					"name": {type: String},
					"desc": {type: String},
					"img": {
						"url": {type: String},
						"alt": {type: String},
					}
				}
			]
		},
		"faq": {
			"intro": {type: String},
			"items": [
				{
					"question": {type: String},
					"answer": {type: String},
				}
			]
		}
	}
}

const model = generateModel(model_name, reorder_paths, data)
export default model




