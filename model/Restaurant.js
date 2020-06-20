let mongoose=require('mongoose');
let Schema=mongoose.Schema;

var RestaurantSchema=new Schema({
    name:{type:String},
    address:{type:String},
    type:{type:String},
    timeOpen:{type:Schema.Types.Date},
    timeClose:{type:Schema.Types.Date},
    phone:{type:String},
    wifi:{type:String},
    description:{type:String},
    province:{type:Schema.Types.ObjectId, ref: 'Province'},
    avatar:{type:String},
    imagesUrl:{type:[String]},
    image:{type:String},
    latitude:{type:Number},
    longitude:{type:Number},
    foodQuery:{type:[String]}
})

module.exports=mongoose.model("Restaurant", RestaurantSchema)