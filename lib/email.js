const nodemailer = require('nodemailer')
const htmlToFormmattedText = require('html-to-formatted-text')
module.exports = credentials=>{
    const mailTransport = nodemailer.createTransport({
        host:'smtp.sendgrid.net',
        auth:{
            user: credentials.sendgrid.user,
            pass: credentials.sendgrid.password
        }
    })
    const from='Andy An <andy@lostbug.com>'
    // const errorRecipient = 'receiver@lostbug.com'

    return {
        send:(to,subject,html)=>{
            mailTransport.sendMail({
                from,
                to,
                subject,
                html,
                text:htmlToFormmattedText
            })
        }
    }
}