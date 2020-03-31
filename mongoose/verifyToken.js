const jwt=require('jsonwebtoken');
const secretkey="qwerty";
//verify the token
exports.verifyToken=(req,res,next)=>{
    const bearer=req.headers["authorization"]
    if(bearer){
        const bearerToken=bearer.split(" ");
        const token=bearerToken[1];
        jwt.verify(token,secretkey,(err,data)=>{
            if(err)
            res.sendStatus(403);
            else{
                console.log(data);
                next();
            }

        })
    }else
    res.send(403);
}


