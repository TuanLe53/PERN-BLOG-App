import { Link, useParams } from "react-router-dom";
import { Loader, Container, Content, Header, Avatar } from 'rsuite';
import MessageIcon from '@rsuite/icons/Message';
import ShareOutlineIcon from '@rsuite/icons/ShareOutline';
import parse from 'html-react-parser';
import { useContext, useEffect, useState } from "react";
import ReactTimeAgo from 'react-time-ago'
import Time from 'react-time-format'
import AuthContext from "../../context/AuthContext"
import "./Post.css"
import avatar from "../../assets/avatar/avatar.png"

export default function Post() {
    const params = useParams()
    const {user} = useContext(AuthContext)

    const [blog, setBlog] = useState();
    const [content, setContent] = useState("");
    const [commentArr, setCommentArr] = useState([]);

    const fetchBlog = async () => {
        const res =  await fetch(`http://localhost:3500/blog/${params.post_id}`)
        const data = await res.json()
        setBlog(data)
    }

    let blog_content
    if (blog) {
        blog_content = parse(blog.content)
    }

    const fetchComment = async () => {
        const res = await fetch(`http://localhost:3500/blog/${params.post_id}/comment`)
        const data = await res.json()
        setCommentArr(data)
    }

    const handleComment = async (e) => {
        e.preventDefault()
        const comment = {
            content: content,
            user_id: user.user_id,
            post_id: params.post_id
        }
        const res = await fetch(`http://localhost:3500/blog/${params.post_id}/comment`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        })
        const data = res.json()
        if(res.status === 200){
            setContent("")
            setCommentArr([comment, ...commentArr])
        }else{
            alert(data.error)
        }
    }

    useEffect(() => { 
        fetchBlog()
        fetchComment()
    }, [])
    
    return (
        <>
            {blog
                ?
                <>
                    <Container>
                        <Header>{blog.title}</Header>
                        <div className="blog-info">
                            <div className="avatar-group">
                                <Avatar src={blog.avatar ? blog.avatar : avatar} circle/>
                                <div>{blog.username}</div>
                            </div>
                            <ReactTimeAgo date={blog.created_at} locale="en-US"/>
                        </div>
                        <Content>{blog_content}</Content>
                    </Container>
                    <div className="comment-box" id="comment-box">
                        <form onSubmit={handleComment} className="add-comment">
                            <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Share your thoughts" />
                            <button type="submit">
                                Send
                            </button>
                        </form>
                        <div className="comments">
                            {commentArr.map(comment => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-info">
                                        <Avatar src={comment.avatar ? comment.avatar : avatar} circle/>
                                        <div>
                                            <p className="comment-user">{comment.username}</p>
                                            <Time value={comment.created_at} format="DD/MM/YYYY" />
                                        </div>
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="blog-btn-group">
                        <Link to={`/profile/${blog.created_by}`}>
                            <Avatar src={blog.avatar ? blog.avatar : avatar} circle/>
                        </Link>
                        <a href="#comment-box">
                            <MessageIcon />
                        </a>
                        <div>
                            <ShareOutlineIcon />
                        </div>
                    </div>
                </>
                :
                <Loader size="lg" center/>
            }
        </>
    )

}