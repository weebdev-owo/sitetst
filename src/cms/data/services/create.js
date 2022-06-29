import image_styles from '/src/styles/images.module.sass'
import  generateForm, {setIV, valid} from '/src/cms/lib/create/generateFormElements'
import {text, textarea, checkbox, image, list, space} from '/src/cms/lib/create/generateFormPrimitives'
// import * as Yup from 'yup'

//IMPORTANT: dont use number keys for objects (in the name arg) (reservered for array in order to create paths)
const create_service_primitive_template = [
    [
        [
            text("url", "name (https://domain/serivices/'name')", valid.name(20)),
            checkbox("enabled", "enabled (if not enabled service will not appear on website)", setIV(true), valid.bool()),
            checkbox("booking", "show in booking form (selectable in booking form services if the service is enabled)", valid.bool()),
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

// const create_service_template = [
//     [
//         [
//             ['text', ["url", "name (https://domain/serivices/'name')"]],
//             ['checkbox', ["enabled", "enabled (if not enabled service will not appear on website)" ]],
//             ['checkbox', ["booking", "show in booking form (selectable in booking form services if the service is enabled)"]],
//         ]
//     ],

//     ['Services Data',
//         [
//             ['text', ["services.tile.order", "order (where the service is placed on services grid)"]],
//             ['text', ["services.tile.name", "name"]],
//             ['textarea', ["services.tile.desc", "description"]],
//             ['image', ["services.tile.img", "background image", image_styles['service-tile']]],
//         ]

//     ],

//     ['Service Page Data',

//         ['Section 1: intro',
//             ['text', ["service.intro.name", "name"] , setIV('OMNOMNOM')],
//             ['textarea', ["service.intro.desc", "description"] ],
//             ['image', ["service.intro.img", "background image", image_styles['fullscreen']]],
//         ],

//         ['Section 2: summary (dark background)', 
//             'Statements',
//             ['text', ["service.summary.s1", "statement1" ]],
//             ['text', ["service.summary.s2", "statement2" ]],
//             ['text', ["service.summary.s3", "statement3" ]],
//             ['image', ["service.summary.img1", "statement image (image 1)", image_styles['summary-1']]],
//             ['space'],
//             'What (part 2)',
//             ['textarea', ["service.summary.what", "text"]],
//             ['image', ["service.summary.img2", "image (image 2)", image_styles['summary-2']]],
//             ['space'],
//             'Why (part 3)',
//             ['textarea', ["service.summary.why", "text" ]],
//             ['image', ["service.summary.img3", "image (image 3)", image_styles['summary-3']]],
//         ],

//         ['Section 3: Our Process',
//             ['textarea', ["service.process.intro", "intro"]],
//             ['list', ["service.process.steps", "Step"],
//                 [
//                     ['text', ['name', `title` ]],
//                     ['textarea', ['desc', `description`]],
//                     ['image', ['img', `image`, image_styles['step']]],
//                 ]
//             ]
//         ],

//         ['Section 4: Info/Faq',
//             ['textarea', ["service.faq.intro", "intro" ]],
//             ['list', ["service.faq.items", "Question"],
//                 [
//                     ['text', ['question', 'question']],
//                     ['textarea', ['answer', 'answer']],
//                 ]
//             ]
//         ]
//     ]
// ]

const [formElements, initialValues, validationSchema] = generateForm(create_service_primitive_template)
export {formElements, initialValues, validationSchema}

