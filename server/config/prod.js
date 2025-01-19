module.exports = {
   SERVER_PORT:process.env.PORT,
   API_PATH: process.env.API_PATH,
   MONGOURI: process.env.MONGOURI,
   JWT_SECRET: process.env.JWT_SECRET,
   SENDGRID_API: process.env.SENDGRID_API,
   BASE_URL: process.env.BASE_URL,
   SERVER_EMAIL: process.env.SERVER_EMAIL,
   TOKEN_EXPIRY_TIME: process.env.TOKEN_EXPIRY_TIME, //1000 * 60 * 60 //1 hour -> miliseconds * sec * minutes,
   ALLOWED_ORIGINS : process.env.ALLOWED_ORIGINS
}