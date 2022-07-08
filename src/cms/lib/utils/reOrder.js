import mongoose from "mongoose";
import {getByPath, setByPath} from '/src/cms/lib/utils/byPath'

export default async function reOrder(initialIdObj, current_order, modelName, path, options){
	const { uid_order_path } = options ?? {}
	const reorder_uid = uid_order_path && (uid_order_path == path)
	try {

		const fullPath = `data.${path}`
		let initial_doc = await mongoose.models[modelName].findOne().where(fullPath).equals(current_order)//.select(fullPath)
		const initialId = initialIdObj?.toString()
		if(initial_doc){
			//get docss with order greater or equal to current order
			const sorter = {}
			sorter[fullPath] = 1
			const docs= await mongoose.models[modelName].find()
				// .select(fullPath)
				.where(fullPath)
				.gte(current_order)
				.sort(sorter)
			//update the array of docs to have a coherent ascending order
			await docs.every(async (doc, i) =>{
				if(getByPath(doc, fullPath) <= current_order){
					if(doc._id.toString() === initialId){return true}
					current_order += 1
					const new_order = {}
					new_order[fullPath] = current_order
					if (reorder_uid) new_order['uid'] = current_order
					const new_doc = await mongoose.models[modelName].updateOne({_id:doc._id}, new_order, {new: true})
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