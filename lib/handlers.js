const fortune = require('./fortune')

exports.home=(req,res)=>res.render('home')

exports.about = (req,res)=>res.render('about',{fortune:fortune.getFortune()})

exports.section = (req,res)=>res.render('section-test')

exports.newsletterSignup = (req,res)=>{
    res.render('newsletter-signup',{csrf:'CSRF token goes here'})
}

exports.newsletterSignupProcess = (req,res)=>{
    console.log('req.body',req.body)
    res.redirect(303,'/newsletter-signup/thank-you')
}

exports.newsletterSignupThankYou= (req,res)=> res.render('newsletter-signup-thank-you')

exports.notFound = (req,res)=>res.render('404')

// eslint-disable-next-line no-unused-vars
exports.serverError = (err,req,res,next)=>res.render('500')
