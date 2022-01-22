const fortune = require('./fortune')

exports.home=(req,res)=>res.render('home')

exports.about = (req,res)=>res.render('about',{fortune:fortune.getFortune()})

exports.section = (req,res)=>res.render('section-test')
exports.newsletter = (req,res)=> res.render('newsletter')
exports.api={
    newsletterSignup:(req,res)=>{
        console.log("res.body",res.body)
        res.send({result:'success'})
    },
    vacationPhotoContest:(req,res,fields,files)=>{
        console.log('field data',fields)
        console.log('files',files)
        res.send({result:'success'})
    }
}
exports.newsletterSignup = (req,res)=>{
    res.render('newsletter-signup',{csrf:'CSRF token goes here'})
}

exports.newsletterSignupProcess = (req,res)=>{
    console.log('req.body',req.body)
    res.redirect(303,'/newsletter-signup/thank-you')
}

exports.newsletterSignupThankYou= (req,res)=> res.render('newsletter-signup-thank-you')

exports.vacationPhoto = (req,res)=>{
    const now = new Date()
    res.render('contest/vacation-photo',{year:now.getFullYear(),month:now.getMonth()})
}
// 上传文件
exports.vacationPhotoContestProccess=(req,res,fields,files)=>{
    console.log('field data',fields)
    console.log('files',files)
    res.redirect(303,'/contest/vacation-photo-thank-you')
}

exports.vacationPhotoContest = (req,res)=>{
    const now = new Date()
    res.render('contest/vacation-photo-contest',{year:now.getFullYear(),month: now.getMonth()})
}
exports.vacationPhotoThankYou = (req,res)=> res.render('contest/vacation-photo-thank-you')

exports.notFound = (req,res)=>res.render('404')

// eslint-disable-next-line no-unused-vars
exports.serverError = (err,req,res,next)=>res.render('500')
