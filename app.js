const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");
const {MONGOURI} = require("./keys");

require('./models/user');
//mongoDB atlas password
/*
usr:instagramClone
pass:r@@tPass
*/
app.use(express.json());
app.use(require("./routes/auth"));
mongoose.connect(MONGOURI, {useNewUrlParser:true, useUnifiedTopology:true})
mongoose.connection.on('connected',()=>{
   console.log("connected to mongo");
})

mongoose.connection.on('error',()=>{
   console.log("error occured in mnongo connection");
})


//custome middleware

const customMiddleware = (req,res,next)=>{
   console.log("middleware executed");
   next();
}

//app.use(customMiddleware);

app.get("/", (req,res)=>{
   console.log('home')
   res.send("Hello world!")
})


app.get("/about",customMiddleware,(req,res)=>{
   console.log('aboutpage')
   res.send("abooutpage")
})

app.listen(PORT,()=>{
   console.log(`server is running on ${PORT}`)
})