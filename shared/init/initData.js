
let provinceData=require("../../data/province.json")
let restaurantData=require('../../data/restaurant.json')
let foodData=require("../../data/food.json")
let reviewData=require("../../data/review.json")
let imageRestaurants=require("../../data/imageRestaurant.json")
let nameRestaurant=require("../../data/nameRestaurant.json");
const db = require("../../model");
var request = require('requestretry');
let randomstring=require('randomstring')

exports.province=function(){
    provinceData.forEach(i=>{
        db.Province.create({
            name:i.city,
            latitude:i.lat,
            longitude:i.lng
        })
    })
    
}


exports.restaurant=function(){
    let data= restaurantData
    console.log(data.length)
    db.Province.find({})
    .limit()
    .lean()
    .exec((err,provinces)=>{
        async.forEachLimit(provinces,1,(province,cb)=>{
            console.log("-----------------------------------")
            let numRestaurant=Math.floor(Math.random() * 4) + 1
            if (province.name=="Hồ Chí Minh")
                numRestaurant=10
            console.log(`generate ${numRestaurant} restaurant for ${province.name}`)
            let arrRes=[]
            for(i=0;i<numRestaurant;i++){
                index=Math.floor(Math.random() * (data.length-1))
                while(arrRes.includes(index))
                    index=Math.floor(Math.random() * (data.length-1))
                arrRes.push(index)
                // generate lat long random
                let rule=null
                let lat= province.latitude
                let long = province.longitude
                let denta = (Math.floor(Math.random() * 9999) + 10)/1000000
                rule= Math.floor(Math.random() * 2) + 1
                lat = (rule==1) ? (lat - denta) : (lat + denta)
                rule= Math.floor(Math.random() * 2) + 1
                long = (rule==1) ? (long -denta) : (long+denta)
                // --------------------------
                let i_name_restaurant=Math.floor(Math.random() * nameRestaurant.length)
                db.Restaurant.create({
                    name:nameRestaurant[i_name_restaurant],
                    address: province.name,
                    type:"quán ăn",
                    timeOpen:moment("2020-06-22T07:00"),
                    timeClose:moment("2020-06-22T22:00"),
                    phone:"0389814400",
                    wifi:{
                        "name":randomstring.generate(10),
                        "password":randomstring.generate(8)
                    },  
                    description:"restaurant",
                    province:province._id,
                    avatar:data[index].MobilePicturePath,
                    image:data[index].MobilePicturePath,
                    latitude:lat,
                    longitude:long,
                    location:{
                        type:"Point",
                        coordinates:[long,lat]
                    }
                },(err,data)=>{
                    if(err) console.log(err)
                })  
            }
            cb()
        },(err)=>{
            console.log("create restaurant success")
        })
    })
    
}

//  create menu
async function createMenu(data){
    console.log("--------------CREATE ALL MENU------------")
    let number_of_menu=Math.floor(Math.random() * 4)+1
    console.log("number_of_menu: ",number_of_menu)
    let arr_id_type=[]
    let output=[]// array save id menu
    // create all menu
    for(let i =0;i<number_of_menu;i++){
        console.log("-----CREATE 1 MENU")
        index_type=Math.floor(Math.random() * 4)
        while(arr_id_type.includes(index_type))
            index_type=Math.floor(Math.random() * 4)
        console.log("index_type:", index_type)
        arr_id_type.push(index_type)
        let menu=await db.Menu.create({
            "name":data[index_type].type
        })
        output.push(menu._id)
        // create foodmenu
        let number_of_food=Math.floor(Math.random() * (data[index_type].foods.length))+1
        console.log("number_of_food:", number_of_food)
        for(let j=0;j<number_of_food;j++){
                await db.FoodMenu.create({
                food:data[index_type].foods[j].name,
                price:(Math.floor(Math.random() * 40)+20)*1000,
                menu:menu._id,
                image:data[index_type].foods[j].img
            })
        }
    }
    return output
}

exports.food=function(){
    let data=foodData
    db.Restaurant.find()
    .lean()
    .exec((err,restaurants)=>{
        async.forEachLimit(restaurants,1,(restaurant,cbRestaurant)=>{
            createMenu(data).then(output=>{
                console.log(output)
               db.MenuRestaurant.create({
                   menu:output,
                   restaurant:restaurant._id
               })
               cbRestaurant()
           })
        },(err)=>{
            console.log("create data success")
        })
    })
}

exports.queryFood=function(){
    db.Restaurant.find({})
    .exec((err,data)=>{
        async.forEachLimit(data,2,(i,cbData)=>{
            lib.restaurant.getFoodQuery(i._id,(err,query)=>{
                query=query.map(i=>{
                    return utils.string.normalizeV2(i)
                })
                i.set({
                    foodQuery:query
                })
                i.save()
            })
            cbData()
        },(err)=>{
            console.log("update food query success")
        })
    })
}

exports.updateAddress=function(){
    db.Restaurant.find({})
    .exec((err,data)=>{
        console.log(data.length)
        let dem=0
        async.forEachLimit(data,1,(i,cbRestaurant)=>{
            request({
                url: `https://us1.locationiq.com/v1/reverse.php?key=3d2b35f1bca396&lat=${i.latitude}&lon=${i.longitude}&format=json`,
                json: true,
                maxAttempts: 1,   // (default) try 5 times
                retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
              }, function(err, response, body){
                  console.log(body)
                if (body && body.display_name) {

                    i.set({
                        address:body.display_name
                    })
                    i.save()
                }
                setTimeout(()=>{
                    console.log(dem++)
                    cbRestaurant()
                },1000)
              });
        },(err)=>{
            console.log('update success')
        })
    })
}

exports.updateImageRestaurant=function(){
    db.Restaurant.find({})
    .exec((err,data)=>{ 
        data.forEach(i=>{
            let index=Math.floor(Math.random() * imageRestaurants.length )
            console.log(index)
            i.set({
                imagesUrl:imageRestaurants[index].img
            })
            i.save()
        })
    })
}


exports.updateReview=function(){
    db.Restaurant.find({})
    .exec((err,data)=>{ 
        data.forEach(i=>{
            let index=Math.floor(Math.random() * reviewData.length )
            console.log(index)
            i.set({
                description:reviewData[index]
            })
            i.save()
        })
    })
}