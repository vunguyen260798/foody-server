module.exports=function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-XSRF-TOKEN, token, gtoken, cookies, Authorization, app, signature, secret")
    req.header('Accept-Language','*');
    req.headers['content-type'] = (req.headers['content-type'] == "application/x-www-form-urlencoded; charset=ISO-8859-1") ? 'application/x-www-form-urlencoded; charset=utf-8': req.headers['content-type']
    next()
}