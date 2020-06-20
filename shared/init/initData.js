
let provinceData=require("../../data/province.json")
let restaurantData=require('../../data/restaurant.json')
let foodData=require("../../data/food.json")

exports.province=function(){
    provinceData.forEach(i=>{
        db.Province.create({
            name:i.city
        })
    })
    
}


exports.restaurant=function(){
    let data= restaurantData
    console.log(data.length)
    db.Province.find({})
    .lean()
    .exec((err,provinces)=>{
        async.forEachLimit(provinces,5,(province,cb)=>{
            let numRestaurant=Math.floor(Math.random() * 4) + 1
            console.log(numRestaurant)
            let arrRes=[]
            for(i=0;i<numRestaurant;i++){
                index=Math.floor(Math.random() * (data.length-1))
                while(arrRes.includes(index))
                    index=Math.floor(Math.random() * (data.length-1))
                arrRes.push(index)
                db.Restaurant.create({
                    name:data[index].Name,
                    address:data[index].Address,
                    type:"quán ăn",
                    timeOpen:"7:00",
                    timeClose:"8:00",
                    phone:"0389814400",
                    wifi:"12345678",
                    description:"restaurant",
                    province:province._id,
                    avatar:data[index].MobilePicturePath,
                    image:data[index].MobilePicturePath,
                    latitude:data[index].Latitude,
                    longitude:data[index].Longitude
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
    for(i of _.range(number_of_menu)){
        console.log("------------CREATE 1 MENU-----------")
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
        for(let j of _.range(number_of_food)){
                console.log("j",j)
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
        async.forEachLimit(restaurants,5,(restaurant,cbRestaurant)=>{
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