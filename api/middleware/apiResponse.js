module.exports=function (req,res,next){
    res.error=function(err){
        let error={
            code:404,
            description:"bad request"
        }
        if(typeof err=="object"){
            error.code=err.code || 404
            error.description=err.message || err.status || "bad request"
        }
        if(typeof err=="string"){
            error.description=err
        }
        res.json(error)
    }
    res.success=function(data,pagination){
        res.json({
            code:200,
            status:"success",
            success:true,
            results:data,
            pagination:pagination
        })
    }
    next()
}