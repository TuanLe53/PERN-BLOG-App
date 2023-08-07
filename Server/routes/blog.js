const express = require("express")
const router = express.Router()
const PostController = require("../controller/PostController");
const commentController = require("../controller/commentController")
const upload = require("../middleware/upload")
const pool = require("../db/db");
const verifyJWT = require("../middleware/verifyJWT");

router.get("/blogs", PostController.Posts)
router.get("/blog/:id", PostController.Post)
router.get("/blogs/:user_id", verifyJWT, PostController.UserPosts)
router.post("/blog/:blog_id/edit", verifyJWT, PostController.EditPostController)
router.get("/blog/:blog_id/comment", commentController.GetComment)
router.post("/blog/:blog_id/comment", verifyJWT, commentController.CreateComment)

router.post("/post", verifyJWT, upload.uploadThumbnail.single("thumbnail"), (req, res) => {
    const { user_id, content, title } = req.body
    let url = null
    if (req.file) {
        url = "http://localhost:3500/images/thumbnail/" + req.file.filename
    }

    pool.query("INSERT INTO blog(title, content, created_by, thumbnail) VALUES($1, $2, $3, $4)", [title, content, user_id, url], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error: "Database error"})
        } else {
            res.status(200).send({ message: "Blog created" });
        }
    })
})

module.exports = router;