import image_styles from '/src/styles/images.module.sass'
import generateForm from '/src/cms/lib/create/generateFormElements'


//IMPORTANT: dont use number keys for objects (reservered for array in order to create paths)
const create_service_template = [
    [
        [
            ['text', ["url", "name (https://domain/serivices/'name')"]],
            ['checkbox', ["enabled", "enabled (if not enabled service will not appear on website)" ]],
            ['checkbox', ["booking", "show in booking form (selectable in booking form services if the service is enabled)"]],
        ]
    ],

    ['Services Data',
        [
            ['text', ["services.tile.order", "order (where the service is placed on services grid)"]],
            ['text', ["services.tile.name", "name"]],
            ['textarea', ["services.tile.desc", "description"]],
            ['image', ["services.tile.img", "background image", image_styles['service-tile']]],
        ]

    ],

    ['Service Page Data',

        ['Section 1: intro',
            ['text', ["service.intro.name", "name"] ],
            ['textarea', ["service.intro.desc", "description"] ],
            ['image', ["service.intro.img", "background image", image_styles['fullscreen']]],
        ],

        ['Section 2: summary (dark background)', 
            'Statements',
            ['text', ["service.summary.s1", "statement1" ]],
            ['text', ["service.summary.s2", "statement2" ]],
            ['text', ["service.summary.s3", "statement3" ]],
            ['image', ["service.summary.img1", "statement image (image 1)", image_styles['summary-1']]],
            ['space'],
            'What (part 2)',
            ['textarea', ["service.summary.what", "text"]],
            ['image', ["service.summary.img2", "image (image 2)", image_styles['summary-2']]],
            ['space'],
            'Why (part 3)',
            ['textarea', ["service.summary.why", "text" ]],
            ['image', ["service.summary.img3", "image (image 3)", image_styles['summary-3']]],
        ],

        ['Section 3: Our Process',
            ['textarea', ["service.process.intro", "intro"]],
            ['list', ["service.process.steps", "Step"],
                [
                    ['text', ['name', `title` ]],
                    ['textarea', ['desc', `description`]],
                    ['image', ['img', `image`, image_styles['step']]],
                ]
            ]
        ],

        ['Section 4: Info/Faq',
            ['textarea', ["service.faq.intro", "intro" ]],
            ['list', ["service.faq.items", "Question"],
                [
                    ['text', ['question', 'question']],
                    ['textarea', ['answer', 'answer']],
                ]
            ]
        ]
    ]
]

export const [createForm, initialValues] = generateForm('Service', create_service_template, 'log')

