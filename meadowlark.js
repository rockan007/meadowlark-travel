const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')
const weatherMiddlware = require('./lib/middleware/weather')

const app = express()
app.engine('handlebars',expressHandlebars.engine({
    defaultLayout:'main',
    helpers:{
        section:function(name,options){
            if(!this._sections){
                this._sections={}
            }
            this._sections[name] = options.fn(this)
            return null
        }
    }
}))

app.disable('x-powered-by')

app.set('view engine','handlebars')

const port = process.env.PORT||3000

app.use(express.static(__dirname+'/public'))

app.use(bodyParser.urlencoded({extended:true}))

app.use(weatherMiddlware)

app.get('/',handlers.home)

app.get('/about',handlers.about)

app.get('/section',handlers.section)

app.get('/newsletter-signup',handlers.newsletterSignup)
app.post('/newsletter-signup/process',handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you',handlers.newsletterSignupThankYou)
// 定制404页
app.use(handlers.notFound)
// 定制500页
app.use(handlers.serverError)

if(require.main == module){
    app.listen(port,()=>{
        console.log(`Express started on http://localhost:${port}; `
        +'press Ctrl+C to terminate.')
    })
}else{
    module.exports = app
}

