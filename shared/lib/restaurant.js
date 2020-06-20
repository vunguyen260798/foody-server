
exports.getFoodQuery=function(restaurantId, callback){
    async.waterfall([
        function getRestaurant(cb){
            db.MenuRestaurant.findOne({
                restaurant:restaurantId
            })
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
            menuIdArr=menus.map(i=>i._id)
            db.FoodMenu.find({
                menu:{
                    $in:menuIdArr
                }
            })
            .exec()
            .then(data=>{
                let foodsQuery=data.map(i=>i.food)
                cb(null,foodsQuery)
            })          
        }
    ],callback)
}