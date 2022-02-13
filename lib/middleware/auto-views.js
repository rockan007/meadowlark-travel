const autoViews = {}
const fs = require('fs')
const {promisify} = require("util")
const fileExists = promisify(fs.exists)

module.exports = async (req,res,next)=>{
    const path = req.path.toLowerCase()
    if(autoViews[path]) return res.render(autoViews[path])

    if(await fileExists(__dirname+'/views'+path+'.handlebars')){
        autoViews[path] = path.replace(/^\//,'')
        return res.render(autoViews[path])
    }
    next()
}