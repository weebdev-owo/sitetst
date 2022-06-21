const path = require('path')
  
module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: ['res.cloudinary.com'],
    },
}

// const path = require('path')
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// })
  
//   module.exports = withBundleAnalyzer({
//     reactStrictMode: true,
//     sassOptions: {
//         includePaths: [path.join(__dirname, 'styles')],
//     },
//     images: {
//         domains: ['res.cloudinary.com'],
//     },
// })