import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Time from 'react-time-format'
import thumbnail from "../../assets/thumbnail/thumbnail_2.jpg"
import blog_thumbnail from "../../assets/thumbnail/thumbnail_3.jpg"
import "./home.css"

export default function Home(){
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3500/blogs")
        .then(res => res.json())
        .then(res => {
            setBlogs(res)
        })
    }, [])

    return (
        <>
            <img src={thumbnail} className="banner" />
            <div>
                <h1>Blog</h1>
                {blogs.map((blog) => (
                <Link to={`/post/${blog.id}`}>
                    <div key={blog.id} className="home-blog">
                        <img src={blog.thumbnail ? blog.thumbnail : blog_thumbnail} />
                        <div>
                            <strong>{blog.title}</strong>
                            <Time value={blog.created_at} format="DD/MM/YYYY" />
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        </>
    )
}