const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const routesServer = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')


mongoose.connect("mongodb+srv://smart:"
+ process.env.API_PASSWORD +
 "@api-1cluster.gxjn8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" , 
 { useNewUrlParser: true ,  useUnifiedTopology: true})
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//CHECK THIS 
// app.use((req, res, next)=>{
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

//     if(req.method === "OPTIONS"){
//         res.header("Access-Control-Allow-Methods", "PUT, DELETE, GET, POST, PATCH")
//         return res.status(200).json({})
//     }
// })


app.use('/products',routesServer)
app.use('/orders', orderRoutes)

app.use((req, res, next)=>{
    const error = new Error('new Error')
    error.status=404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({
        error:{
            message: "An error occured"
        }
    })
})

module.exports = app












// app.use((req, res, next)=>{
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods', 'PUT, DELETE, GET, POST, PATCH')
//         res.status(200).json({})
//     }
// })




















