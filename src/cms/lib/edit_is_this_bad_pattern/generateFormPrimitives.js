const text =  (name, label, ...args) => ['text', [name, label], ...args]
const textarea =  (name, label, ...args) => ['textarea', [name, label], ...args]
const checkbox =  (name, label, ...args) => ['checkbox', [name, label], ...args]
const image =  (name, label, style, ...args) => ['image', [name, label, style], ...args]
const list = (list_name, item_label, contents, ...args) => ['list', [list_name, item_label], contents, ...args]
const space = () => ['space']

export {text, textarea, checkbox, image, list, space}