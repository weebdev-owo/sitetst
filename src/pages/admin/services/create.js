
import CmsCreateForm from '/src/cms/lib/create/cmsCreateForm'
import {formElements, initialValues, validationSchema} from '/src/cms/data/services/create'

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

export default function Page(){
    return <>
        <CmsCreateForm 
            initialValues={initialValuesFilled} 
            validationSchema={validationSchema}
            cmsTitle={'Service'}
            cmsPath={'services'} // the folder in cms/data which corresponds to the data in this page
            id_path={'url'} //the path in values to the unique id of this data
            // revalidate={['/', ['services','use id']]} //pages to perform on demand isr
            revalidate={[]} //pages to perform on demand isr
        >
            {formElements}
        </CmsCreateForm>
    </>
}

