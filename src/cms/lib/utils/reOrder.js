import mongoose from "mongoose";
import {getByPath, setByPath} from '/src/cms/lib/utils/byPath'

export default async function reOrder(current_order, modelName, path, options){
	const { uid_is_order } = options ?? {}
	try {
		const fullPath = `data.${path}`
		let orderExists = await mongoose.models[modelName].findOne().where(fullPath).equals(current_order).select(fullPath)
		// console.log('ORDER EXISTS', orderExists)
		if(orderExists){
			//get docss with order greater or equal to current order
			const sorter = {}
			sorter[fullPath] = 1
			const docs= await mongoose.models[modelName].find()
				.select(fullPath)
				.where(fullPath)
				.gte(current_order)
				.sort(sorter)

			//update the array of docs to have a coherent ascending order
			docs.every(async (doc, i) =>{
				if(getByPath(doc, fullPath) <= current_order){
					current_order += 1
					const new_order = {}
					new_order[fullPath] = current_order
					// setByPath(doc, fullPath, current)
					if (uid_is_order) new_order['uid'] = current_order
					await mongoose.models[modelName].updateOne({_id:doc._id}, new_order)
					return true
				}
				else {return false}
			})
		}
        return true
	}
	catch (e){
		console.log(e)
		return false
	}
}