import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import Time from 'react-time-format'
import { Avatar, Button, Modal } from "rsuite";
import MoreIcon from '@rsuite/icons/More';
import EditIcon from '@rsuite/icons/Edit';
import AuthContext from "../../context/AuthContext"
import avatar from "../../assets/avatar/avatar.png"
import thumbnail from "../../assets/thumbnail/thumbnail.jpg"
import "./userProfile.css"

export default function UserProfile() {
    const { user } = useContext(AuthContext)
    const params = useParams();

    const [blogs, setBlogs] = useState([])

    const fetchUserPosts = async () => {
        const res = await fetch(`http://localhost:3500/blogs/${params.user_id}`)
        const data = await res.json()
        setBlogs(data)
    }

    useEffect(() => {
       fetchUserPosts() 
    },[params])

    return (
        <div className="user-profile">
            <Box />
            <div className="blog-box">
                <div className="box-title">Blogs</div>
            {blogs.map((blog) => (
                <div key={blog.id} className="blog">
                    <img src={blog.thumbnail ? blog.thumbnail : thumbnail} className="thumbnail"/>
                    <div className="blog-info-wrapper">
                        <Link to={`/post/${blog.id}`} className="title">
                            {blog.title}
                        </Link>
                        <Time value={blog.created_at} format="DD/MM/YYYY" />
                        {params.user_id === user.user_id &&
                            <Link to={`/edit/${blog.id}`}>
                                <EditIcon />
                            </Link>
                        }
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

function Box() {
    const params = useParams()
    const { user } = useContext(AuthContext)

    const [info, setInfo] = useState()
    const fetchUser = async () => {
        const res =  await fetch(`http://localhost:3500/profile/${params.user_id}`)
        const data = await res.json()
        setInfo(data)
    }

    const [open, setOpen] = useState(false)

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const updateAvatar = async (e) => {
        e.preventDefault()
        let data = new FormData()
        data.append("avatar", file)

        let res = await fetch(`http://localhost:3500/update/avatar/${user.user_id}`, {
            method: "PUT",
            body: data,
            credentials: "include"
        })
        if (res.status === 200) {
            alert("Success")
            setOpen(false)
            fetchUser()
        } else {
            alert("Failed")
        }
    }

    const [bio, setBio] = useState("");
    const updateBio = async (e) => {
        e.preventDefault()
        let data = {bio: bio}
        let res = await fetch(`http://localhost:3500/update/bio/${user.user_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include"
        })
        if (res.status === 200) {
            alert("Success")
            setBio("")
            setOpen(false)
            fetchUser()
        } else {
            alert("Failed")
        }
    }

    useEffect(() => {
        fetchUser()
    },[params])

    return (
    <>
        {
            info
            ?
            <div className="user-box">
                <div className="avatar-wrapper">
                    <Avatar src={info.avatar ? info.avatar : avatar} circle/>
                    <h1>{info.username}</h1>
                </div>
                <div className="user-info">
                     <div>
                        <p>ID: {info.id}</p>
                        <p>Email: {info.email}</p>
                    </div>
                    <div>
                        <MoreIcon />
                    </div>
                </div>
                <div className="user-bio">
                    {info.bio}
                </div>
                {user.user_id === info.id && <Button onClick={() => setOpen(true)}><EditIcon/></Button>}
                    <Modal open={open} handleClose={() => setOpen(false)}>
                        <Modal.Body>
                            <div>
                                <form onSubmit={updateAvatar}>
                                    <label>Change Avatar</label><br />
                                    <input type="file" onChange={handleFileChange} name="avatar" required/><br />
                                    <Button appearance="primary" type="submit">Update</Button>
                                </form>        
                            </div>
                            <div>
                                <form onSubmit={updateBio}>
                                    <label>Change Bio</label><br />
                                    <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={info.bio} required/><br />
                                    <Button appearance="primary" type="submit">Update</Button>
                                </form>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button onClick={() => setOpen(false)} appearance="subtle">Cancel</Button>
                        </Modal.Footer>
                    </Modal>
            </div>
            :
            <>
                Loading
            </>
            }
    </>
    )
}