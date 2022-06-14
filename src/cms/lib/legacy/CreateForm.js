import styles from '/src/cms/lib/create/cms.module.sass'
import {Text, TextArea, CheckBox, List, FormImage, Space} from '/src/cms/lib/create/primitives'
import image_styles from '/src/styles/images.module.sass'

const img = {
    "original": null,
    "cropped": null,
    "url": "",
    "alt": "edit for better seo"
}
const step = {
    "name": "",           
    "desc": "",
    "img": img,
}
const question = {
    "question": "",           
    "answer": "",
}
export const initialValues = {
    "url": "",
    "enabled": true,
    "booking":true,
    services: {
        tile: {
            "order":"",
            "name":"",
            "desc":"",
            "img": img,
        },
    },
    service:{
        intro: {
            "name":"",
            "desc":"",
            "img": img,
        },
        summary: {
            "s1":"",
            "s2":"",
            "s3":"",
            "img1": img,
            "what":"",
            "img2": img,
            "why":"",
            "img3": img,
        },
        process:{
            "intro":"",
            "steps": [],
        },
        faq: {
            "intro":"",
            "items": [],
        },
    },  
}

export const createElement = {
    "space": () => {return <Space />},
    "text": (name, label) => {return <Text name={name} label={label} />},
    "textarea": (name, label) => {return <TextArea name={name} label={label} />}, 
    "checkbox": (name, label) => {return <CheckBox name={name} label={label} />}, 
    "image": (name, label, style) => {console.log('image style is',style); return <FormImage name={name} label={label} image_style={style} />}, 
    "list": (name, item_template, item_label, content) => {
        console.log("RENDERING", content)
        return <List name={name} item_template={item_template} item_label={item_label}>
            {(i, list_name) => <div>
                {content.map((item) =>{
                    if(item[0] === 'image'){console.log('IMAGE WITH STYLE', item[1][2])}
                    if(item.length > 1){
                        console.log('ITEMS', item)
                        return createElement[item[0]](`${list_name}.${i}.${item[1][0]}`, ...item[1].slice(1))
                    }
                    else{
                        return createElement[item[0]]()
                    }
                })}
            </div>}
        </List>
    }, 
}




// const page_title = 'Page Title'
// const section_title = 'Section Title'
// const label = 'label'
// const styleIn = image_styles['summary-1']

// const item_template = {
//     'name4': '',
//     'name5': 'null',
//     'name6': null,
//     'name7': img,
// }

// export const example_initialValues = {
//     'name1':{'nameu': null},
//     'name2': null,
//     'name3': img,
//     'listname1': []
// }

// const example_form_template = [
//     [page_title,
//         [section_title,
//             ['textarea', ['name1.nameu', label]],
//             ['checkbox', ['name2', label]],
//             ['image', ['name3', label, styleIn]],
//             ['space'],
//             ['list', ['listname1', item_template, 'item label'], [
//                 ['text',[ 'name4', label]],
//                 ['textarea', ['name5', label]],
//                 ['checkbox', ['name6', label]],
//                 ['image', ['name7', label, styleIn]],
//                 ['space']
//             ]]
//         ]
//     ]
// ]


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
            ['list', ["service.process.steps", step, "Step"],
                [
                    ['text', ['name', `title` ]],
                    ['textarea', ['desc', `description`]],
                    ['image', ['img', `image`, image_styles['step']]],
                ]
            ]
        ],

        ['Section 4: Info/Faq',
            ['textarea', ["service.faq.intro", "intro" ]],
            ['list', ["service.faq.items", question, "Question"],
                [
                    ['text', ['question', 'question']],
                    ['textarea', ['answer', 'answer']],
                ]
            ]
        ]
    ]
]


// EXAMPLE LIST
// ['list', [name, item_template, item_label], [
//     ['text',[ name, label]],
//     ['text-area', [name, label]],
//     ['check-box', [name, label]],
//     ['image', [name, label, styleIn]],
//     ['space']
// ]]

function generateForm(title, formTemplate){

    const form = []
    const initialValues = {}
    // add title to form
    form.push(<div className={styles["heading"]}>{`Create ${title}`}</div>)

    //fill form
    formTemplate.forEach((page)=>{
        //if page title add it
        if(typeof page[0] === 'string'){
            const page_title = page.splice(0, 1)
            form.push(<div className={styles["sub-heading"]}>{page_title}</div>)
        }
        //add each page tot the form
        page.forEach((section) =>{
            //if section title add it to form
            if(typeof section[0] === 'string'){
                const section_title = section.splice(0, 1)
                form.push(<div className={styles["sub-heading"]}>{section_title}</div>)
            }

            //add each primitive element to the page_section
            const page_section = []
            section.forEach((item) =>{
                const type = item[0]
                // console.log('ITEM RENDERING', item, type)
                if(type === 'image'){console.log('IMAGE WITH STYLE', item[1][2], ...item[1])}
                if(typeof item ==='string'){page_section.push(<div>{item}</div>)}
                else if (type === 'list'){ page_section.push(createElement[type](...item[1], item[2])) }
                else{ page_section.push(item.length > 1 ? createElement[type](...item[1]):createElement[type]()) }
            })
            //add page_section to form
            form.push(<div className={styles['page-section']}>{page_section}</div>)
        })
    })

    //add buttons to form
    form.push(<div className={styles["submit-section"]}>
        <button type="submit" className={styles["submit"]}>{`Create ${title}`}</button>   
    </div>)

    return form
}
// export const exampleForm = generateForm('EXAMPLE', example_form_template)
export const createForm = generateForm('Service', create_service_template)

