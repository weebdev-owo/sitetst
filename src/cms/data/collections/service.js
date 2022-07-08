//MODEL
import generateModel from '/src/cms/lib/models/gernerateModel'
import imgSchema from '/src/cms/lib/models/schemas/img'
//FORM
import generateCreateForm from '/src/cms/lib/create/generateCreateForm'
import generateEditForm from '/src/cms/lib/edit/generateEditForm'
import image_styles from '/src/styles/images.module.sass'

//MODEL
const model_name = 'Service'
const reorder_paths = ['services.tile.order', 'home.tile.order']
const data = {
	"url": {type: String, },
	"enabled":{type: Boolean},
	"booking": {type: Boolean},
	"home": {
		"tile": {
			"enabled": {type: Boolean},
			"order": {type: Number, min: 0},
			"name": {type: String},
			"desc": {type: String},
			"img": imgSchema
		}
	},
	"services": {
		"tile": {
			"order": {type: Number, min: 0},
			"name": {type: String},
			"desc": {type: String},
			"img": imgSchema
		}
	},
	"service": {
		"intro": {
			"name": {type: String},
			"desc": {type: String},
			"img": imgSchema
		},
		"summary": {
			"s1": {type: String},
			"s2": {type: String},
			"s3": {type: String},
			"img1": imgSchema,
			"what": {type: String},
			"img2": imgSchema,
			"why": {type: String},
			"img3": imgSchema
		},
		"process": {
			"intro": {type: String},
			"steps": [
				{
					"name": {type: String},
					"desc": {type: String},
					"img": imgSchema
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
const model = generateModel(model_name, reorder_paths, data, {
	uid_type: String,
})

//FORM
const initialValuesFilled = {
    "url": "thrh",
    "enabled": true,
    "booking": true,
    "home": {
          "tile": {
              "enabled": true,
              "order": "4",
              "name": "drh",
              "desc": "drgh",
              "img": {
                  "original": null,
                  "cropped": null,
                  "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                  "alt": "edit for better seo"
              }
          }
      },
    "services": {
        "tile": {
            "order": "4",
            "name": "drh",
            "desc": "drgh",
            "img": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        }
    },
    "service": {
        "intro": {
            "name": "drgh",
            "desc": "drh",
            "img": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        },
        "summary": {
            "s1": "drh",
            "s2": "drh",
            "s3": "drh",
            "img1": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            },
            "what": "drh",
            "img2": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            },
            "why": "drh",
            "img3": {
                "original": null,
                "cropped": null,
                "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                "alt": "edit for better seo"
            }
        },
        "process": {
            "intro": "drh",
            "steps": [
                {
                    "name": "drh",
                    "desc": "drh",
                    "img": {
                        "original": null,
                        "cropped": null,
                        "url": "https://res.cloudinary.com/ryuzakithe3rd/image/authenticated/s--PCG5tnyn--/q_auto:eco/v1654226886/mcfdtest/temp/2572ec684773b98cbc2e68500_d3ivtu.jpg",
                        "alt": "edit for better seo"
                    }
                }
            ]
        },
        "faq": {
            "intro": "drh",
            "items": [
                {
                    "question": "drh",
                    "answer": "drh"
                },
                {
                    "question": "drg",
                    "answer": "rg"
                }
            ]
        }
    },
    "isEditorOpen": false,
    "editorFileName": "",
    "editorPreviewStyle": null,
    "isSubmitOpen": false
}
const item_name = 'service'
const configs = {
	initialValuesFilled: initialValuesFilled,
    title: `Landing Slide`,
	idPath: 'url', 
    pagePath: `${item_name}`, 
    filePath: `collections/${item_name}`, 
    revalidate: [[item_name, 'use id'], '/'], 
}

const generate_template = (primitives, setIV, valid) =>{
    const {text, textarea, checkbox, image, list, space} = primitives
    return [
        [
            [
                text("url", "name (https://domain/serivices/'name')", valid.name(20)),
                checkbox("enabled", "enabled (if not enabled service will not appear on website)", setIV(true), valid.bool()),
                checkbox("booking", "show in booking form (selectable in booking form services if the service is enabled)", valid.bool()),
            ]
        ],
    
        ['Home Page',
            ['What We Do Best',
                checkbox("home.tile.enabled", "show in 'what we do best' (if the service is enabled)", setIV(true), valid.bool()),
                text("home.tile.order", "order (where the service is placed on the grid)", valid.int(1, 1000)),
                text("home.tile.name", "name", valid.text(200)),
                textarea("home.tile.desc", "description", valid.text(500)),
                image("home.tile.img", "background image", image_styles['service-tile']),
            ]
        ],
        
        ['Services Page',
            ['Service Tile',
                text("services.tile.order", "order (where the service is placed on services grid)", valid.int(1, 1000)),
                text("services.tile.name", "name", valid.text(200)),
                textarea("services.tile.desc", "description", valid.text(500)),
                image("services.tile.img", "background image", image_styles['service-tile']),
            ]
        ],
    
        ['Service Page',
    
            ['Intro',
                text("service.intro.name", "name" , valid.text(200)),
                textarea("service.intro.desc", "description", valid.text(1000)),
                image("service.intro.img", "background image", image_styles['fullscreen']),
            ],
    
            ['Summary (dark background)', 
                'Statements',
                text("service.summary.s1", "statement1", valid.text(100)),
                text("service.summary.s2", "statement2", valid.text(100)),
                text("service.summary.s3", "statement3", valid.text(100)),
                image("service.summary.img1", "statement image (image 1)", image_styles['summary-1']),
                space(),
    
                'What (part 2)',
                textarea("service.summary.what", "text", valid.text(2000)),
                image("service.summary.img2", "image (image 2)", image_styles['summary-2']),
                space(),
    
                'Why (part 3)',
                textarea("service.summary.why", "text", valid.text(2000)),
                image("service.summary.img3", "image (image 3)", image_styles['summary-3']),
            ],
    
            ['Our Process',
                textarea("service.process.intro", "intro", valid.text(4000)),
                list("service.process.steps", "Step", [
                    text('name', `title`, valid.text(100)),
                    textarea('desc', `description`, valid.text(500)),
                    image('img', `image`, image_styles['step']),
                ])
            ],
    
            ['Info /  Faq',
                textarea("service.faq.intro", "intro", valid.text(4000)),
                list("service.faq.items", "Question", [
                    text('question', 'question', valid.text(200)),
                    textarea('answer', 'answer', valid.text(2000)),
                ])
            ]
        ]
    ]
} 

const [createValidationSchema, createForm] = generateCreateForm(configs, generate_template)
const [editValidationSchema, editForm] = generateEditForm(configs, generate_template)

export { createValidationSchema, editValidationSchema, createForm, editForm, model}



