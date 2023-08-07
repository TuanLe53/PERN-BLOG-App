const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");
const upload = require('../middleware/upload');
const pool = require("../db/db");
const verifyJWT = require("../middleware/verifyJWT");


router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/logout", userController.logoutUser)
router.get("/profile/:user_id", verifyJWT, userController.getUserInfo)

router.put("/update/bio/:user_id", verifyJWT, userController.updateBio)
router.put("/update/avatar/:user_id", verifyJWT, upload.uploadAvatar.single("avatar"), (req, res) => {
    let user_id = req.params.user_id
    let url = "http://localhost:3500/images/avatar/" + req.file.filename

    pool.query("UPDATE account SET avatar = $1 WHERE id = $2", [url, user_id], (error) => {
        if (error) {
            return res.status(500).json({error: "Database error"})
        }
        return res.status(200).json({ message: 'File uploaded successfully!' });
    })
})

module.exports = router;