import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from "dompurify";
import AuthContext from "../../context/AuthContext";

const  modules  = {
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script:  "sub" }, { script:  "super" }],
        ["blockquote", "code-block"],
        [{ list:  "ordered" }, { list:  "bullet" }],
        [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
        ["link", "image", "video"],
        ["clean"],
    ],
    // imageResize: true
};

export default function Edit() {
    const params = useParams();
    const {accessToken} = useContext(AuthContext)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchBlog = async () => {
        const res =  await fetch(`http://localhost:3500/blog/${params.post_id}`)
        const data = await res.json()
        setTitle(data.title)
        setContent(data.content)
    }

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === "" || content === "") {
            return alert("Error")
        }
        let clean = DOMPurify.sanitize(content);
        let blog = {
            id: params.post_id,
            title: title,
            content: clean
        }
        const res = await fetch(`http://localhost:3500/blog/${params.post_id}/edit`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": "text/html; charset=UTF-8",
                'Authorization': 'Bearer ' + String(accessToken.accessToken)
            },
            body: JSON.stringify(blog),
            credentials: 'include',
        })
        const data = await res.json()
        if (res.status === 200) {
            alert(data.message)
            navigate("/")
        } else {
            alert(data.error)
        }
    }

    useEffect(() => {
        fetchBlog()
    },[])

    return (
        <>
            {content ?
                <div className="editor">
                    <label for="title">Title: </label>
                    <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder={title} required id='title'></input>
                    <ReactQuill theme="snow" modules={modules} value={content} onChange={setContent} />
                    <button onClick={handleSubmit}>UPDATE</button>
                </div>
                :
                <>
                    Loading
                </>
            }
        </>
    )
}