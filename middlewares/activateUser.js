const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{

    try {

        const {token} = req.params;
        if(!token)
        {
            return res.status(400).json({
                "error":"invalid token"
            })
        }


        const decoded  =  jwt.verify(token, process.env.ACTIVATION_SECRET_KEY);
        if(!decoded)
        {
            return res.status(400).json({
                "error":"invalid token"
            });
        }
        req.body.email = decoded.email;
        next();
    } catch (error) {
        return res.status(500).json({
           "error": `${error.message}`
        })
    }



    
}