const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.header["authorization"]
    if (!authHeader) {
        return res.sendStatus(401)
    }
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = decode.username
        console.log("WORK")
        next()
    })
}

module.exports =  verifyJWT 