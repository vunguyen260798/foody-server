var express = require('express')
var app = express.Router()
let middleware=require("./middleware")
let morgan=require('morgan')
let bodyParser=require("body-parser")
let controllers=require("./controllers")
let fileUpload=require("express-fileupload")
/**
 *  SET MIDDLEWARE FOR ALL API
 */
app.all("/*",
middleware.corsFilter,
middleware.apiResponse,
bodyParser.urlencoded({extended:true}),
bodyParser.json({limit:"50mb"}),
middleware.processRequest,
morgan("dev")
)

app.get("/restaurants",controllers.restaurant.getAll)
app.get("/restaurants/:id/menu",controllers.restaurant.getMenu)
module.exports = app