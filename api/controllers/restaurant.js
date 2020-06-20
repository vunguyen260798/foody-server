const db = require("../../model")

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
                    menu.foods=data
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
 *  GET: /restaurants
 *  
 */
exports.getAll=async function(req,res){
    let count=await db.Restaurant.find({}).count()
    db.Restaurant.find({})
    .populate("province")
    .skip(req.query.skip)
    .limit(req.query.limit)
    .lean()
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
                count:results.length,
                pageSize:req.query.pageSize,
                pageIndex:pageIndex,
                pageCount:Math.ceil(Number(count)/Number(req.query.pageSize))
            })
        }
    })
}
