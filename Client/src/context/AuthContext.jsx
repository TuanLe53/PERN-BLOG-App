import { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()
export default AuthContext;

export const AuthProvider = ({children}) => {
    let [accessToken, setAccessToken] = useState(()=> localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('accessToken') ? jwt_decode(localStorage.getItem('accessToken')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const handleLogin = async (form, e) => {
        e.preventDefault()
        const res = await fetch("http://localhost:3500/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        const data = await res.json()

        if (res.status === 200) {
            setAccessToken(data)
            setUser(jwt_decode(data["accessToken"]))
            localStorage.setItem("accessToken", JSON.stringify(data))
            navigate("/")
        } else {
            alert(data.error)
        }
    }

    const logoutUser = () => {
        fetch("http://localhost:3500/logout", {
            method: "GET",
            credentials: "include",
        })
        setAccessToken(null)
        setUser(null)
        localStorage.removeItem("accessToken")
        // navigate("/")
    }

    const updateToken = async () => {
        let res = await fetch("http://localhost:3500/refresh", {
            method: "GET",
            headers:{
                'Content-Type':'application/json'
            },
            credentials: 'include',
        })

        if (res.status === 200) {
            let data = await res.json()
            setAccessToken(data)
            setUser(jwt_decode(data["accessToken"]))
            localStorage.setItem("accessToken", JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        accessToken:accessToken,
        handleLogin:handleLogin,
        logoutUser:logoutUser,
    }

    useEffect(() => {
        if (loading) {
            updateToken()
        }
        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(() => {
            if (accessToken) {
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)
    }, [accessToken, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}