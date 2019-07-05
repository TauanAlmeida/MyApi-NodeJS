const nodemailer = require('nodemailer')
const mailer = require('../../config/mail')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const transport = nodemailer.createTransport({
    host: mailer.host,
    port: mailer.port,
    auth: {
      user: mailer.user,
      pass: mailer.pass
    }
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/resources/mail/'),
      layoutsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }
  
  transport.use('compile', hbs(handlebarOptions))

  module.exports = transport