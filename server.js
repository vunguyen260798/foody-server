let express = require("express");
let app = express();
let PORT = process.env.PORT || 3000
let mongoose = require("mongoose");
let router = require("./api/router")
let init = require("./shared/init");
const db = require("./model");
const moment = require("moment");
require('dotenv').config()

// init global variable
init.initGlobal({
    db: require("./model"),
    _: require("lodash"),
    async: require("async"),
    logger: require("log4js").getLogger(),
    moment: require("moment"),
    lib: require("./shared/lib"),
    utils:require("./shared/utils"),
    config:require("config")
})
mongoose.connect(config.mongo.url);
console.log(config)
console.log(process.env.NODE_ENV)
/**
 * init data
 */
//init.initData.province()
//init.initData.restaurant()
//init.initData.food()
//init.initData.queryFood()
//init.initData.updateAddress()
//init.initData.updateImageRestaurant()
//init.initData.updateReview()
app.use('/api', router)

app.listen(PORT, () => {
    console.log(`app is running on ${PORT} ...`)
})