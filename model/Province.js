let mongoose=require('mongoose');
let Schema=mongoose.Schema;

var ProvinceSchema=new Schema({
    name:{type:String},
    slug:{type:String}
})

ProvinceSchema.pre('save', function(next) {
   let self=this
   if(self.isNew)
      self.slug = utils.string.normalize(self.name)
   next();
 });
module.exports=mongoose.model("Province", ProvinceSchema)