/**
 *  input= {
 *      db:
 *      async:require("async")
 *  }
 */
module.exports=function initGlobal(input,cb){
    Object.keys(input).forEach(function(key) {
        global[key]=input[key]
    });
    return Promise.resolve(()=>{
        return true
    })
}