let mongoose=require('mongoose');
let Schema=mongoose.Schema;

var MenuSchema=new Schema({
    name:{type:String},
    slug:{type:String},
    query:{type:String}
})

module.exports=mongoose.model("Menu", MenuSchema)