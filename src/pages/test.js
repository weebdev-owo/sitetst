import Table from '/src/cms/lib/menu/table'

const layout = [
    // ['title', 'path'],
    ['Url Name', 'url'],
    ['Order', 'services.tile.order'],
    ['Enabled', 'enabled'],
    ['Booking', 'booking'],
]

const options = {
    'model_path': 'service',
    'id_path': 'url',
    'edit': ['/admin', '/service', '/edit/', 'use id'],
    'view': ['/services/', 'use id'],
    'order': 'services.tile.order',
}
export default function Test({}){
    return <>
        <Table layout={layout} options={options}/>
    </>
}

