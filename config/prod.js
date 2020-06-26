module.exports = {
   MONGOURI:process.env.MONGOURI,
   JWT_SECRET:process.env.JWT_SECRET,
   SENDGRID_API : process.env.SENDGRID_API,//`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`,
   BASE_URL:process.env.BASE_URL,//"https://an-instagram.herokuapp.com"
   SERVER_EMAIL:"vinay@vinayrajput.com",
   TOKEN_EXPIRY_TIME: process.env.TOKEN_EXPIRY_TIME//1000 * 60 * 60 //1 hour -> miliseconds * sec * minutes,
}