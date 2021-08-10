const {verify} = require('jsonwebtoken')

module.exports = {
    checkToken: (req,res,next)=>{
        let token = req.get('authorization')
        if(token){
            token = token.slice(7)
            verify(token, '1234',(err, decoded)=>{
                
                if(err){
                     return res.json({
                         success:0,
                         message:"invalid token"
                     });
                }else{
                   req.user = decoded.result;
                   return next()
                }
            })
        }else{
            return res.json({
                success:0,
                message:"unauthorization"
            });
        }
        

    }
}
