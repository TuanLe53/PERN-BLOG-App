const pool = require("../db/db")

const GetComment = async (req, res) => {
    const post_id = req.params.blog_id
    
    try {
        const data = await pool.query("SELECT comment.id, content, created_at, username, avatar, account.id, avatar FROM comment JOIN account ON comment.user_id = account.id WHERE blog_id = $1 ORDER BY created_at DESC", [post_id])
        const comments = data.rows
        return res.status(200).json(comments)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Database error"})
    }
}

const CreateComment = async (req, res) => {
    const { user_id, post_id, content } = req.body

    pool.query("INSERT INTO comment(content, user_id, blog_id) VALUES($1, $2, $3)", [content, user_id, post_id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error: "Database error"})
        } else {
            res.status(200).send({ message: "Comment Created" });
        }
    })

}

module.exports = {GetComment, CreateComment}