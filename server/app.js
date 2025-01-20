const express = require("express");
const app = express();
const {MONGOURI, SERVER_PORT,ALLOWED_ORIGINS, API_PATH} = require("./config/keys");
const PORT = SERVER_PORT || 3000;
const mongoose = require("mongoose");
const log4js = require('log4js');
const cors = require('cors')


require('./models/user');
require("./models/post");

log4js.configure({
    appenders: { fileAppender: { type: 'file', filename: 'logs/stdout.log' } },
    categories: { default: { appenders: ['fileAppender'], level: 'error' } }
});
// const logger = {...log4js.getLogger(), info : (msg)=>{ console.log(msg); log4js.getLogger().info(msg); }};
const logger = log4js.getLogger();
//mongoDB atlas password

console.log = (msg)=>{
    logger.info(msg);
}

mongoose.connect(MONGOURI, {})
    .then(connection=>{
        logger.info('Connected to mongodb')
    });

mongoose.connection.on('error',(er)=>{
    logger.info(`error occurred in mongo connection ${er}`)
})
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url} `);
    next();
});
const allowedOrigins = ALLOWED_ORIGINS.split(",");
app.use(cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            logger.info('origin',origin,'allowedOrigins',allowedOrigins);
            if(allowedOrigins.some(allowedOrigin => origin.indexOf(allowedOrigin) !==-1 )){
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: false
    })
);


app.use(express.json());

const routes= express.Router();
routes.use(require("./routes/auth"));
routes.use(require("./routes/post"));
routes.use(require("./routes/user"));
app.use(API_PATH,routes);

if(process.env.NODE_ENV === "production") // Disable this line to test react build as prod environment
{
    app.use(express.static("../client/build"))
    const path = require("path");

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '..','client',"build", 'index.html'));
    });
}

app.get(`${API_PATH}/`, (req,res)=>{
    logger.info('request received on root')
    res.send("Apis for An-Instagram clone")
})

app.listen(PORT,()=>{
    logger.info(`server is running on ${PORT}`)
})