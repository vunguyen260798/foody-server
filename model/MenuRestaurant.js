let mongoose=require('mongoose');
let Schema=mongoose.Schema;

var MenuRestaurantSchema=new Schema({
    menu:{type:[Schema.Types.ObjectId], ref: 'Menu'},
    restaurant:{type:Schema.Types.ObjectId, ref: 'Restaurant'}
})

module.exports=mongoose.model("MenuRestaurant", MenuRestaurantSchema)