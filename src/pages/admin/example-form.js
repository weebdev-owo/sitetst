
import * as Yup from 'yup'
import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import validationSchema from '/src/cms/service/validationSchema'
import {exampleForm, example_initialValues} from '/src/cms/service/CreateForm'
const img = {
    "original": null,
    "cropped": null,
    "url": "",
    "alt": "edit for better seo"
}

// const yup_validation2 = Yup.object({})
const initialValues2 = {
  "url": "thrh",
  "enabled": true,
  "booking": true,
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

export default function Home(){
    return <>
        {/* <Create /> */}
        <CmsCreateForm 
            initialValues={example_initialValues} 
            validationSchema={Yup.object({}) || validationSchema}
            imageUrl={'http://localhost:3000/api/uploadSingleImage'}
            dbUrl={'http://localhost:3000/api/cmsCreate'}
            cmsTitle={'Service'}
            model_path={'service'}
            id_path={'url'}
            revalidate={['/', ['services','use id']]}
        >
            {exampleForm}
        </CmsCreateForm>

    </>
}

