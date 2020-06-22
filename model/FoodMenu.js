let mongoose=require('mongoose');
let Schema=mongoose.Schema;

var FoodMenuSchema=new Schema({
    food:{type: String},
    price:{type:Number},
    menu:{type: Schema.Types.ObjectId, ref: 'Menu'},
    image:{type:String},
    slug:{type:String}
})
FoodMenuSchema.pre('save', function(next) {
    let self=this
    if(self.isNew)
       self.slug = utils.string.normalize(self.food)
    next();
  });
module.exports=mongoose.model("FoodMenu", FoodMenuSchema)