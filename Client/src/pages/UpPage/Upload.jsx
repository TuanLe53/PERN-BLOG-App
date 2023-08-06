import { useContext, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import {Button} from 'rsuite';
// import { ImageResize } from 'quill-image-resize-module';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import "./upload.css"

// Quill.register('modules/imageResize', ImageResize);

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


export default function Upload() {
    const {user} = useContext(AuthContext)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate()

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (title === "" || content === "") {
            return alert("Error")
        }
        let clean = DOMPurify.sanitize(content);

        let formData = new FormData()
        formData.append("user_id", user.user_id)
        formData.append("content", clean)
        formData.append("title", title)
        formData.append("thumbnail", file)

        const res = await fetch("http://localhost:3500/post", {
            method: "POST",
            body: formData,
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

    return (
        <div className='editor'>
            <label for="title">Title: </label>
            <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required id='title'></input>
            <label for="thumbnail">Thumbnail: </label>
            <input type="file" onChange={handleFileChange} name="thumbnail" required/><br />
            <ReactQuill theme="snow" modules={modules} onChange={setContent} placeholder="Enter your content here..." />
            <Button onClick={handleSubmit} appearance='primary'>UPLOAD</Button>
        </div>
    )
}