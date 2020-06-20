module.exports=function (req,res,next){
        req.query.pageIndex=Number(req.query.pageIndex) || 1
        req.query.pageSize=Number(req.query.pageSize) || 10
        req.query.limit=Number(req.query.limit) || Number(req.query.pageSize)
        req.query.skip=Number(req.query.skip) || Number(req.query.pageSize) * (Number(req.query.pageIndex)-1)
    next() 
}