import generateModel from '/src/cms/lib/models/gernerateModel'
import generateCreateForm from '/src/cms/lib/create/generateCreateForm'
import generateEditForm from '/src/cms/lib/edit/generateEditForm'
import firstUpper from '/src/cms/lib/utils/firstUpper'

export default function CreatePageData({page_name, section_name, reorder_paths, data, generate_template}){
    const model_name = `PageData-${page_name}_${section_name}`
    const model = generateModel(model_name, reorder_paths, data, {
        uid_type: String,
        uid_default: `${page_name}_${section_name}`,
        collection_name: 'PageData'
    })
    //FORM
    const configs = {
        title: `${firstUpper(section_name)}`,
        pagePath: `PageData/${page_name}/${section_name}`, 
        filePath: `PageData/${page_name}_${section_name}`, 
        idPath: '', 
        revalidate: [`/${page_name}`], 
        viewUrl: (v)=>`/${page_name}`, 
        editUrl: (v) =>`/admin/PageData/${page_name}/${section_name}`,
        viewText: (v)=>`view ${page_name}`,
        editText: (v)=>`edit ${page_name} ${section_name}`,
        isPageData: true,
    }
    
    const [createValidationSchema, createForm] = generateCreateForm(configs, generate_template)
    const [editValidationSchema, editForm] = generateEditForm(configs, generate_template)

    return { createValidationSchema, editValidationSchema, createForm, editForm, model}
}