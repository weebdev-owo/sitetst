const formidable = require('formidable')

function asyncParse (req, opts) {
    return new Promise(function (resolve, reject) {
      var form = new formidable.IncomingForm(opts)
      form.parse(req, function (err, fields, files) {
        if (err) return reject(err)
        resolve({ fields: fields, files: files })
      })
    })
}

module.exports = asyncParse