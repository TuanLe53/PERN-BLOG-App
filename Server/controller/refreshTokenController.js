const jwt = require("jsonwebtoken");
require("dotenv").config()
const pool = require("../db/db")

const refreshTokenController = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)

    const refreshToken = cookies.jwt
    const data = await pool.query("SELECT id, username, email FROM account LEFT JOIN refresh_token ON account.id = refresh_token.account_id WHERE refresh_token.refresh_token = $1", [refreshToken])
    const user = data.rows
    if (user.length === 0) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
        if (err || user[0].username !== decode.username) return res.sendStatus(403)
        
        const accessToken = jwt.sign(
            {
                "username": decode.username,
                "user_id": decode.user_id
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 60 * 5 }
        )
        res.json({ accessToken })
    })
}

module.exports = refreshTokenController;