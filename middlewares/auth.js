const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try {

        const bearerToken = req.headers.authorization;
        const token = bearerToken.split(' ')[1];
        if(!token)
        {
            return res.status(400).json({
                "error":"Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.body.id = decoded.id;
        next();

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
           
            "error":"Invalid token"
        })
    }
}