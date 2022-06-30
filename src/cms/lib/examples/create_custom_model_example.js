// import mongoose from "mongoose";
// import reOrder from "/src/cms/lib/utils/reOrder"
// import { getByPathThis, getByPath } from '/src/cms/lib/utils/byPath';

// const layout = {
// 	createdAt: {type: Date, immutable: true, default: () => Date.now()},
// 	updatedAt: {type: Date, default: () => Date.now()},
// 	activeDate: {type: Date, default: () => Date.now()},
// 	data: {
// 		"enabled": {type: Boolean},
// 		"order": {type: Number, min: 0, max: 1000,},
// 		"title": {type: String},
// 		"desc": {type: String},
// 		"img": {
// 			"url": {type: String},
// 			"alt": {type: String},
// 		}
// 	}
// }
// const Schema = new mongoose.Schema(layout);


// //MIDDLEWARE
// //before save
// Schema.pre('save', async function(next){

// 	this.updatedAt = Date.now()
// 	let reorders = true
// 	for await (const path of reorder_paths){
// 		const reordered = await reOrder(getByPath(this.data, path), model_name, path)
// 		reorders &&= reordered
// 		if (!reordered){
// 			const error = {
// 				errors: [
// 					{properties: 
// 						{
// 							reason: 'db', 
// 							message: `a ${model_name} with the unique id [ ${this._id} ] and order [ ${getByPath(this.data, path)} ] failed to trigger all reorder paths ${reorder_paths}. Try again, or check server/database configurations.`
// 						}
// 					}
// 				]
// 			}
// 			next(error)
// 			break
// 		}
// 	}
// 	if(reorders){next()}
// })


// //after save
// Schema.post('save', function(document, next){
// 	if(document){console.log(`saved ${model_name}`)}
// 	else{console.log(`something went wrong saving ${model_name}`)}
// 	next()
// })

// export default mongoose.models[model_name] || mongoose.model(model_name, Schema);


//EXAMPLE 2/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const service_layout = {
// 	createdAt: {type: Date, immutable: true, default: () => Date.now()},
// 	updatedAt: {type: Date, default: () => Date.now()},
// 	activeDate: {type: Date, default: () => Date.now()},
// 	data: {
// 		"url": {
// 			type: String, 
// 			minLength: 1,
// 			maxLength: 100,
// 			validate: {
// 				validator: async name => {return !(await mongoose.models.Service.countDocuments({'data.url': name}))},
// 				message: err => `A service with the url name [ ${err.value} ] already exists, the url name of a service must be unique. \n Change the url name and try again`,
// 				reason: 'Validation'
// 			},
// 		},
// 		"enabled":{type: Boolean},
// 		"booking": {type: Boolean},
// 		"services": {
// 			"tile": {
// 				"order": {type: Number, min: 0, max: 100,},
// 				"name": {type: String},
// 				"desc": {type: String},
// 				"img": {
// 					"url": {type: String},
// 					"alt": {type: String},
// 				}
// 			}
// 		},
// 		"service": {
// 			"intro": {
// 				"name": {type: String},
// 				"desc": {type: String},
// 				"img": {
// 					"url": {type: String},
// 					"alt": {type: String},
// 				}
// 			},
// 			"summary": {
// 				"s1": {type: String},
// 				"s2": {type: String},
// 				"s3": {type: String},
// 				"img1": {
// 					"url": {type: String},
// 					"alt": {type: String},
// 				},
// 				"what": {type: String},
// 				"img2": {
// 					"url": {type: String},
// 					"alt": {type: String},
// 				},
// 				"why": {type: String},
// 				"img3": {
// 					"url": {type: String},
// 					"alt": {type: String},
// 				}
// 			},
// 			"process": {
// 				"intro": {type: String},
// 				"steps": [
// 					{
// 						"name": {type: String},
// 						"desc": {type: String},
// 						"img": {
// 							"url": {type: String},
// 							"alt": {type: String},
// 						}
// 					}
// 				]
// 			},
// 			"faq": {
// 				"intro": {type: String},
// 				"items": [
// 					{
// 						"question": {type: String},
// 						"answer": {type: String},
// 					}
// 				]
// 			}
// 		}

// 	}
// }

// const ServiceSchema = new mongoose.Schema(service_layout);


// //MIDDLEWARE
// //before save
// ServiceSchema.pre('save', async function(next){
// 	//update updatedAt before saving
// 	this.updatedAt = Date.now()

// 	//if a service with the assigned order already exists then where necesary order other services such that there are no duplicate orders but the order is maintained
// 	try {
// 		let current_order = this['data']['services']['tile']['order']
// 		let orderExists = await mongoose.models.Service.findOne().where('data.services.tile.order').equals(current_order).select('data.services.tile.order')
// 		if(orderExists){
// 			//get services with order greater or equal to current order
// 			const services = await mongoose.models.Service.find()
// 				.select('data.services.tile.order')
// 				.where('data.services.tile.order')
// 				.gte(current_order)
// 				.sort({'data.services.tile.order':1})

// 			//update the array of services to have a coherent ascending order
// 			services.every(async (service, i) =>{
// 				if(service['data']['services']['tile']['order'] <= current_order){
// 					current_order += 1
// 					// services[i]['service-tile'].order = current_order
// 					await mongoose.models.Service.updateOne({_id:service._id}, {'data.services.tile.order': current_order})
// 					return true
// 				}
// 				else {return false}
// 			})
// 		}
// 		next()
// 	}
// 	catch (e){
// 		console.log(e)
// 		return
// 	}

// })


// //after save
// ServiceSchema.post('save', function(document, next){
// 	if(document){console.log('saved service document with title: ', document.data.url)}
// 	else{console.log('something went wrong saving document with title', document.data.url)}
// 	next()
// })

// module.exports = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

