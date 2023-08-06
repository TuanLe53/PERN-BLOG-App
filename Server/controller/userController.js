const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const pool = require("../db/db");

const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    
    try {
        const data = await pool.query("SELECT * FROM account WHERE username = $1", [username])
        const arr = data.rows
        if (arr.length != 0) {
            return  res.status(400).json({error: "Username already there, No need to register again."});
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    res.status(err).json({error: "Server error"});
                }
                const user = {
                    username,
                    email,
                    password: hash,
                }
                pool.query("INSERT INTO account(username, email, user_password) VALUES($1, $2, $3)", [user.username, user.email, user.password], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({error: "Database error"})
                    } else {
                        res.status(200).send({ message: 'User added to database, not verified' });
                    }
                })
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Database error while registring user!"})
    }
};

const loginUser = async (req, res) => {
    let { username, password } = req.body
    try {
        const data = await pool.query("SELECT * FROM account WHERE username = $1", [username])
        const user = data.rows
        if (user.length === 0) {
            res.status(400).json({error: "User is not found. Please sign up first."})
        } else {
            bcrypt.compare(password, user[0].user_password, function (err, result) {
                if (err) {
                    res.status(500).json({error: "Server error"})
                } else if (result === true) {

                    const accessToken = jwt.sign(
                        {
                            "username": user[0].username,
                            "user_id": user[0].id
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: 60 * 5}
                    )
                    const refreshToken = jwt.sign(
                        {
                            "username": user[0].username,
                            "user_id": user[0].id
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: "1d"}
                    )
                    modify_refresh_token(user, refreshToken)
                    
                    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.status(200).json({accessToken})
                } else {
                    if (result != true) {
                        res.status(400).json({error: "Please enter correct password"})
                    }
                }
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Database error occurred while signing in!"})
    }
}

const logoutUser = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt

    const data = await pool.query("SELECT id, username, email FROM account LEFT JOIN refresh_token ON account.id = refresh_token.account_id WHERE refresh_token.refresh_token = $1", [refreshToken])
    const user = data.rows
    if (user.length === 0) { 
        res.clearCookie("jwt", {httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }
    pool.query("DELETE FROM refresh_token WHERE account_id = $1", [user[0].id])
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true })
    res.sendStatus(204)
}

const modify_refresh_token = async (user, refreshToken) => {
    const check_token = await pool.query("SELECT * FROM refresh_token WHERE account_id = $1", [user[0].id])
    if (check_token.rows.length === 0) {
        pool.query("INSERT INTO refresh_token(account_id, refresh_token) VALUES($1, $2)", [user[0].id, refreshToken])
    } else {
        pool.query("UPDATE refresh_token SET refresh_token = $1, valid_from = NOW(), valid_until = NOW() + INTERVAL '1 DAY' WHERE account_id = $2",[refreshToken, user[0].id])
    }
}

const getUserInfo = async (req, res) => {
    const user_id = req.params.user_id

    try {
        const data = await pool.query("SELECT id, username, email, bio, avatar FROM account WHERE id = $1", [user_id])
        const user_info = data.rows[0]
        return res.status(200).json(user_info);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Database error"})
    }
}

const updateBio = async (req, res) => {
    const user_id = req.params.user_id
    const bio = req.body.bio

    pool.query("UPDATE account SET bio = $1 WHERE id = $2", [bio, user_id], (error) => {
        if (error) {
            console.log(error)
            return res.status(500).json({error: "Database error"}) 
        }
        return res.status(200).json({message: "UPDATED"});
    })
}

module.exports = { registerUser, loginUser, logoutUser, getUserInfo, updateBio };