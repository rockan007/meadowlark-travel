const nodemailer = require('nodemailer')

const { credentials } = require("./config");

const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password,
  },
})

async function go() {
  try {
    const result = await mailTransport.sendMail({
      from: '"Meadowlark Travel" <andy@lostbug.com>',
      to: 'rockan007@gmail.com',
      subject: 'Your Meadowlark Travel Tour',
      text: 'Thank you for booking your trip with Meadowlark Travel.  ' +
        'We look forward to your visit!',
    })
    console.log('mail sent successfully: ', result)
  } catch(err) {
    console.log('could not send mail: ' + err.message)
  }
}

go()
const emailService = require('./lib/email')(credentials)
emailService.send('rockan007@yeah.net', "Hood River tours on sale today!",
"Get 'em while they're hot!")