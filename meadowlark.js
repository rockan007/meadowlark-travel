const express = require('express')
const bodyParser = require('body-parser')
const expressHandlebars = require('express-handlebars')
const multiparty = require('multiparty')
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
app.use(bodyParser.json())

app.use(weatherMiddlware)

app.get('/',handlers.home)

app.get('/about',handlers.about)

app.get('/section',handlers.section)
//fetch
app.get('/newsletter',handlers.newsletter)
app.post('/api/newsletter-signup',handlers.api.newsletterSignup)
app.get('/newsletter-signup',handlers.newsletterSignup)
app.post('/newsletter-signup/process',handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you',handlers.newsletterSignupThankYou)

app.get('/contest/vacation-photo',handlers.vacationPhoto)
// 上传文件
app.post('/contest/vacation-photo/:year/:month',(req,res)=>{
    const form = new multiparty.Form()
    form.parse(req,(err,fields,files)=>{
        if(err) return res.status(500).send({error:err.message})
        handlers.vacationPhotoContestProccess(req,res,fields,files)
    })
})
app.get('/contest/vacation-photo-contest',handlers.vacationPhotoContest)
app.post('/api/vacation-photo-contest/:year/:month',handlers.api.newsletterSignup)
app.get('/contest/vacation-photo-thank-you',handlers.vacationPhotoThankYou)
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

