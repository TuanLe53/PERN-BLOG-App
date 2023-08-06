import { Container, Header, Content, Form, ButtonToolbar, Button } from 'rsuite';
import AuthContext from "../../context/AuthContext";
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    let { handleLogin } = useContext(AuthContext)

    return (
        <Container>
            <Header>Login</Header>
            <Content>
                <Form fluid onSubmit={handleLogin} id="login-form">
                    <Form.Group>
                        <Form.ControlLabel>Username</Form.ControlLabel>
                        <Form.Control name="username" placeholder="Enter your username" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Password</Form.ControlLabel>
                        <Form.Control name="password" type="password" autoComplete="off" placeholder="Enter your password" required/>
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button appearance="primary" type="submit">Sign in</Button>
                            <Link to="/register">Register</Link>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Content>
        </Container>
    )
}

export default Login