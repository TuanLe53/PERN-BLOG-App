import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import "./Register.css"

export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            return alert("Password do not match")
        }
        let user = {
            username: username,
            email: email,
            password: password,
        }
        const res = await fetch("http://localhost:3500/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        const data = await res.json()
        if(res.status === 200){
            alert("User created. Please login!")
            navigate("/login")
        }else{
            alert(data.error)
        }
    }

    return (
        <div id="register-page">
            <h1><a href="/">Blog</a></h1>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label><br />
                <input type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required></input><br />
                <label>Email</label><br />
                <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}required></input><br />
                <label>Password</label><br />
                <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required></input><br />
                <label>Re-enter your password</label><br />
                <input type="password" placeholder="Enter your password again" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required></input><br />
                <div className="btnHolder">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}