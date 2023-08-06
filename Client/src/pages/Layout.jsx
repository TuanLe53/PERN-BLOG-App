import { Dropdown } from 'rsuite';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import AdminIcon from '@rsuite/icons/Admin';
import { Outlet, Link } from "react-router-dom"
import { useContext, useState, forwardRef } from "react"
import AuthContext from "../context/AuthContext"

const NavLink = forwardRef(({ href, children, ...rest }, ref) => (
    <Link ref={ref} to={href} {...rest}>
      {children}
    </Link>
  ));

function Layout() {
    const {user, logoutUser} = useContext(AuthContext)
    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300){
            setVisible(true)
        } 
        else if (scrolled <= 300){
            setVisible(false)
        }
    };
      
    const scrollToTop = () =>{
        window.scrollTo({
            top: 0, 
            behavior: 'smooth'
        });
    };

    window.addEventListener('scroll', toggleVisible);
    
    return (
        <>
            <header className="nav-bar">
                <div>
                    <h1><a href="/">Blog</a></h1>
                    {user ?
                        <Dropdown title={user.username} noCaret>
                            <Dropdown.Item as={NavLink} href={`/profile/${user.user_id}`}>Profile</Dropdown.Item>
                            <Dropdown.Item as={NavLink} href="/upload">Upload</Dropdown.Item>
                            <Dropdown.Item onClick={logoutUser}>Log out</Dropdown.Item>
                        </Dropdown>
                        :
                        <div className="auth-btn">
                            <a className="login-btn" href="/login">Login</a>
                            <a className="reg-btn" href="/register">Register</a>
                        </div>
                    }

                </div>
                <nav>
                    <a href="/">Category</a>
                    <a href="/">Category</a>
                    <a href="/">Category</a>
                    <a href="/">Category</a>
                    <a href="/">Category</a>
                    <a href="/">Category</a>
                    <a href="/">Category</a>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
            
            <button onClick={scrollToTop} style={{ visibility: visible ? 'visible' : 'hidden' }} id="goToTop">
                <ArrowUpLineIcon />
            </button>
        </>
    )
}

export default Layout