import mongoose from "mongoose";
console.log('defining service schema')
const ServiceSchema = new mongoose.Schema({
	title: {
		type: String, 
		minLength: 1,
		maxLength: 100,
		validate: {
			validator: async title => !(await mongoose.models.Service.countDocuments({title})),
			message: props => `a service with the title ${props.value} already exists, the title of a service must be unique`
		},
	},
	createdAt: {type: Date, immutable: true, default: () => Date.now()},
	updatedAt: {type: Date, default: () => Date.now()},
	activeDate: {type: Date, default: () => Date.now()},
	disable: {type: Boolean},

	"service-tile": {
		order: {type: Number, min: 0, max: 100,},
		name: {type: String},
		desc: {type: String},
		img: {type: String},
		alt: {type: String},
		link: {type: String},
	},
	
	"service-page": {
		intro: {
			title: {type: String},
			desc: {type: String},
			img: {type: String},
		},

		summary: {
			intro: {
				statements: [{type: String}],
				img: {type: String}
			},
			what: {
				text: {type: String},
				img: {type: String}
			},
			why:{
				text: {type: String},
				img: {type: String}
			},
		},

		process: {
			intro: {type: String},
			steps: {
				names: [{type: String}],
				descs: [{type: String}],
				imgs: [{type: String}],
			},
		},

		faq: {
			intro: {type: String},
			questions: [{type: String}],
			answers: [{type: String}],
		},

		book: {
			services: Boolean,
		},
	},
	  
});

//unique title validation
// ServiceSchema.path('title').validate(async (title) => {
// 	const titleCount = await mongoose.models.Service.countDocuments({title: title})
// 	return !titleCount
// }, 'the title of a service must be unique, a service with that title already exists')
//custom valdator message gives to us an object of the structure {type: , path: , value: }
//MIDDLEWARE
//pre save change updated at date

ServiceSchema.pre('save', async function(next){
	//update updatedAt before saving
	this.updatedAt = Date.now()

	//if a service with the assigned order already exists then increment where necesary such that there are no duplicate orders; all services with an order that are equal to or greater than the assigned order
	try {
		const assigned_order = this['service-tile'].order
		// const orderExists = await mongoose.models.Service.countDocuments({'service-tile.order': assigned_order})
		// if(orderExists){
		// 	console.log('other orders found rearranging')
		// 	const services = await mongoose.models.Service
		// 		.where('service-tile.order')
		// 		.gte(this['service-tile'].order)
		// 		.sort({'service-tile.order': 1})
		// 	let prev
		// 	services.forEach(async (service) => {

		// 	})
		// }
		// else{
		// 	console.log('no other services with order', this['service-tile'].order)
		// }
		const orderExists = await mongoose.models.Service.findOne().where('service-tile.order').equals(assigned_order)
		if(orderExists){
			orderExists['service-tile'].order = assigned_order + 1
			await orderExists.save() //chain the opertaion by calling this pre hook everytime an order is detected with the same value as the assigned_order
		}
		next()
	}
	catch (e){
		console.log(e)
		return
	}
	console.log('finally')

})

ServiceSchema.post('save', function(document, next){
	if(document){console.log('saved service document with title: ', document.title)}
	else{console.log('something went wrong')}
	next()
})

module.exports = mongoose.models.Service || mongoose.model("Service", ServiceSchema);


