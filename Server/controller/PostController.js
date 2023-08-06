const pool = require("../db/db")

const Posts = async (req, res) => {
    try {
        let data = await pool.query("SELECT id, title, created_by, created_at, thumbnail FROM blog")
        let blogs = data.rows
        res.status(200).json(blogs)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Database error"})
    }
}

const Post = async (req, res) => {
    let id = req.params

    try {
        const data = await pool.query("SELECT blog.id, title, content, thumbnail, created_at, created_by, username, avatar FROM blog JOIN account ON blog.created_by = account.id WHERE blog.id = $1", [id.id])
        const blog = data.rows[0]
        return res.status(200).json(blog);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Database error"})
    }
}

const UserPosts = async (req, res) => {
    const user_id = req.params.user_id

    try {
        const data = await pool.query("SELECT id, title, thumbnail, created_by, created_at FROM blog WHERE created_by = $1", [user_id])
        const blogs = data.rows
        return res.status(200).json(blogs);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Database error"})
    }
}

const UpPostController = async (req, res) => {
    const { user_id, title, content } = req.body

    pool.query("INSERT INTO blog(title, content, created_by) VALUES($1, $2, $3)", [title, content, user_id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error: "Database error"})
        } else {
            res.status(200).send({ message: "Blog created" });
        }
    })
}

const EditPostController = async (req, res) => {
    const { id, title, content } = req.body

    pool.query("SELECT * FROM blog WHERE id = $1", [id], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error: "Database error"})
        } else {
            pool.query("UPDATE blog SET title = $1, content = $2 WHERE id = $3", [title, content, id]) 
            return res.status(200).json({message: "UPDATED"})
        }
    })
}

module.exports = { Posts, UpPostController, Post, UserPosts, EditPostController }