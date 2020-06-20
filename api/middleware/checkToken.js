let jwt=require("jsonwebtoken")
module.exports=function(req,res,next){
    let token=req.headers.token
    jwt.verify(token,config.authen.secret_key,(err)=>{
        if(err)
            res.error({
                code:401,
                message:"token is invalid"
            })
        else{
            next()
        }
    })
}