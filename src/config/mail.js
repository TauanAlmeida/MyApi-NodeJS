const {MAIL_PORT, MAIL_PASS, MAIL_USER, MAIL_HOST} = require('../../.env')

module.exports = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    user: MAIL_USER,
    pass: MAIL_PASS
}