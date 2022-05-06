import mongoose from "mongoose";
console.log('defining service schema')
const ServiceSchema = new mongoose.Schema({
	url: {
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


//MIDDLEWARE
//before save
ServiceSchema.pre('save', async function(next){
	//update updatedAt before saving
	this.updatedAt = Date.now()

	//if a service with the assigned order already exists then where necesary order other services such that there are no duplicate orders but the order is maintained
	try {
		let current_order = this['service-tile'].order
		let orderExists = await mongoose.models.Service.findOne().where('service-tile.order').equals(current_order).select('service-tile.order')
		if(orderExists){
			//get services with order greater or equal to current order
			const services = await mongoose.models.Service.find()
				.select('service-tile.order')
				.where('service-tile.order')
				.gte(current_order)
				.sort({'service-tile.order':1})

			//update the array of services to have a coherent ascending order
			services.every(async (service, i) =>{
				if(service['service-tile'].order <= current_order){
					current_order += 1
					// services[i]['service-tile'].order = current_order
					await mongoose.models.Service.updateOne({_id:service._id}, {'service-tile.order': current_order})
					return true
				}
				else {return false}
			})
		}
		next()
	}
	catch (e){
		console.log(e)
		return
	}

})

//after save
ServiceSchema.post('save', function(document, next){
	if(document){console.log('saved service document with title: ', document.title)}
	else{console.log('something went wrong')}
	next()
})

module.exports = mongoose.models.Service || mongoose.model("Service", ServiceSchema);


