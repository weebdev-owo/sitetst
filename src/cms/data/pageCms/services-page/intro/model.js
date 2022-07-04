import generateModel from '/src/cms/lib/models/gernerateModel';
import pageCmsId from '/src/cms/lib/models/schemas/pageCmsId'

const model_name = 'servicesPage_intro'
const reorder_paths = []
const data = {
    pageCmsId: pageCmsId(model_name),
    "desc": {type: String},
	"img": {
		"url": {type: String},
		"alt": {type: String},
	}
}

const model = generateModel(model_name, reorder_paths, data, 'pageCms')
export default model



