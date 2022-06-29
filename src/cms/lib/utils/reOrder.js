import mongoose from "mongoose";
import {getByPath} from '/src/cms/lib/utils/byPath'

export default async function reOrder(current_order, modelName, path){
	try {
		const fullPath = `data.${path}`
		let orderExists = await mongoose.models[modelName].findOne().where(fullPath).equals(current_order).select(fullPath)
		console.log('ORDER EXISTS', orderExists)
		if(orderExists){
			//get items with order greater or equal to current order
			const sorter = {}
			sorter[fullPath] = 1
			const items= await mongoose.models[modelName].find()
				.select(fullPath)
				.where(fullPath)
				.gte(current_order)
				.sort(sorter)

			//update the array of items to have a coherent ascending order
			items.every(async (item, i) =>{
				if(getByPath(item, fullPath) <= current_order){
					current_order += 1
					const new_order = {}
					new_order[fullPath] = current_order
					await mongoose.models[modelName].updateOne({_id:item._id}, new_order)
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