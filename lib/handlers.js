const fortune = require('./fortune')
const { credentials } = require("../config");
const emailService = require('../lib/email')(credentials)
// fake "newsletter signup" interface
class NewsletterSignup {
    constructor({ name, email }) {
      this.name = name
      this.email = email
    }
    async save() {
      // here's where we would do the work of saving to a database
      // since this method is async, it will return a promise, and
      // since we're not throwing any errors, the promise will
      // resolve successfully
    }
  }

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
const VALID_EMAIL_REGEX = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
      "[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" +
      "(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
  );
exports.newsletterSignupProcess = (req,res)=>{
    const name = req.body.name || "",
    email = req.body.email || "";
  // 输入验证
  if (VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: "danger",
      intro: "Validation error!",
      message: "The email address you entered was not valid.",
    };
    return res.redirect(303, "/newsletter");
  }
  // NewsletterSignup只是你可能会创建的对象的一个例子；
  // 由于每个项目的实现都不一样，这些项目特定的接口要怎么写由你来决定。
  // 这里只是演示一种典型的通过Express来实现的写法
  new NewsletterSignup({ name, email }).save((err) => {
    if (err) {
      req.session.flash = {
        type: "danger",
        intro: "Database error!",
        message: "There was a database error; please try again later.",
      };
      return res.redirect(303, "/newsletter/archive");
    }
    req.session.flash = {
      type: "success",
      intro: "Thank you!",
      message: "You have now been signed up for the newsletter.",
    };
    return res.redirect(303, "/newsletter/archive");
  });
}
exports.newsletterArchive = (req,res)=> res.render('/newsletter/archive')
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

exports.cartCheckout=(req,res,next)=>{
  const cart = {}
  if(!cart) next(new Error('Cart does not exit!'))
  const name ='an007'||'',email= 'rockan007@yeah.net'||''
  if(!email.match(VALID_EMAIL_REGEX)){
    return res.next(new Error('Invalid eamil address.'))
  }
  cart.number=Math.random().toString.replace(/^0\.0*/,'')
  cart.billing={
    name,
    email
  }
  res.render('email/cart-thank-you',{layout:null,cart},
    (err,html)=>{
      console.log('rendered email',html)
      if(err) console.log('error in email template')
      emailService.send(email,'some template',html)
        .then((info)=>{
          console.log('sent!',info)
          res.render('cart-thank-you',{cart})
        })
        .catch(err=>{
          console.error('Unable to send confirmation: ' + err.message)
        })
    }
  )
}
exports.handlerError = (req,res)=>{
  console.log(res)
  throw new Error('Nope!')
}
exports.notFound = (req,res)=>res.render('404')

// eslint-disable-next-line no-unused-vars
exports.serverError = (err,req,res,next)=>res.render('500')
