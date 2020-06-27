const db = require("../../model")
var geodist = require('geodist')


/**
 *  GET: /user/id/:_id/get
 */
exports.getById=function(req,res){
    let id=req.params._id
    db.User.findOne({
        _id:id
    })
    .lean()
    .exec((err,user)=>{
        if(err || !user) res.error(err || new Error("user not found"))
        else{
            delete user.password
            res.success(user)
        }
    })
}
/**
 *  POST: /restaurants/:id/menu
 *  response: [
 *  {
 *      name:"Com",
 *      foods:[{
 *          name:"",
 *          price:""
 *      }]
 *  }
 *  ]
 */
exports.getMenu=async function(req,res){
    let id=req.params.id
    async.waterfall([
        function getRestaurant(cb){
            db.MenuRestaurant.findOne({
                restaurant:id
            })
            .skip(req.query.skip)
            .limit(req.query.limit)
            .lean()
            .exec(cb)
        },
        function getAllMenu(restaurant,cb){
            if(!restaurant)
                cb(new Error("not found menu of this restaurant"))
            else
                db.Menu.find({
                    _id:{
                        $in:restaurant.menu
                    }
                })
                .lean()
                .exec(cb)
        },
        function getDetailMenu(menus,cb){
            async.map(menus,(menu,cbMenu)=>{
                let foods=db.FoodMenu.find({
                    menu:menu._id
                })
                .select('food price image slug')
                .lean()
                .exec()
                foods.then(data=>{
                    menu.foods=data.map(i=>{
                        i.name=i.food
                        delete i.food
                        return i
                    })
                    cbMenu(null,menu)
                })
            },cb)
        }
    ],(err,results)=>{
        if(err) res.error(err)
        else
            res.success(results)
    })
}

/**
 *  GET: /restaurants?keyword=a&latitude=120.5&longitude=12345&province=ho-chi-minh
 *  
 */
exports.getAll=async function(req,res){
    // define filter
    let keyword=req.query.keyword
    let province=req.query.province
    let filter={}
    if(keyword){
        console.log(utils.string.normalizeV2(keyword))
        let patt=new RegExp(utils.string.normalizeV2(keyword),"gi")
        filter={
            $or:[
                {name:patt},
                {address:patt},
                {
                    foodQuery:patt
                }
            ]
        }
    }
    if(province){
        let provinceData=await db.Province.findOne({
            slug:province
        })
        filter.province=(provinceData) ? provinceData._id : null
    }
    console.log(filter)
    // define sort
    let sort={
        "_id":-1
    }
    let pipeline=[]
    if (req.query.latitude && req.query.longitude){
        sort={
            "distance":1
        }
        pipeline.push({
            $geoNear:{
                near: { type: "Point", coordinates: [ Number(req.query.longitude) , Number(req.query.latitude) ] },
                distanceField:"distance",
                maxDistance: 15000
            }
        })
    }
    // define pipeline
    pipeline=pipeline.concat([ 
        {
        $match:filter
    },{
        $project:{
            foodQuery:0,
            location:0
        }
    }
    ,{
        $lookup:{
            from:'provinces',
            localField:'province',
            foreignField:"_id",
            as:"province"
        }
    },{
        $unwind:"$province"
    },{
        $sort:sort
    },{
        $skip:req.query.skip
    },{
        $limit:req.query.limit
    }])
    let count=await db.Restaurant.find(filter).count()
    db.Restaurant.aggregate(pipeline)
    .exec((err,restaurants)=>{
        if(err ) res.error(err || new Error("restaurant not found"))
        else{
            results=restaurants.map(i=>{
                i.province=i.province.name
                return i
            })
            let temp= Math.round(Number(req.query.skip)/ Number(req.query.limit))
            let pageIndex=(Number(req.query.skip)%Number(req.query.limit)==0) ?
               temp + 1 : temp
            res.success(results,{
                count:count,
                pageSize:req.query.pageSize,
                pageIndex:pageIndex,
                pageCount:Math.ceil(Number(count)/Number(req.query.pageSize))
            })
        }
    })
}


/**
 * /api/restaurants/:id/wifi
 * body:{
 *      "password"
 * }
 */
exports.update=function(req,res){
    let id=req.params.id
    let password=req.body.password
    db.Restaurant.findOne({
        _id:id
    })
    .exec((err,restaurant)=>{
        if(err) res.error(err || new Error("restaurant not found"))
        else{
            restaurant.set({
                "wifi.password":password
            })
            restaurant.save((err,data)=>{
                if(err) res.error(err)
                else{
                    res.success(data)
                }
            })
        }
    })
}