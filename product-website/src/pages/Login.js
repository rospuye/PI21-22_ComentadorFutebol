import React, { useState } from 'react'
import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import SmallerTitle from '../components/SmallerTitle'

import { useCookies } from 'react-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import '../components/components_css/Form.css'

import axios from 'axios'

function isAlphaNumeric(str) {
    let code, i, len

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false
        }
    }
    return true
}

function validatePassword(password) {
    const lower = /[a-z]/
    const upper = /[A-Z]/
    const digit = /[0-9]/
    const non_alphanumeric = /^.*[^a-zA-Z0-9].*$/

    if (password.length > 7 // length is 8+ characters
        && lower.test(password) // has at least one lowercase letter
        && upper.test(password) // has at least one uppercase letter
        && digit.test(password) // has at least one digit
        && non_alphanumeric.test(password)) // has at least one non-alphanumeric character
    {
        return true
    }
    return false
}

function validateUsername(username) {
    if (username.length > 2 // length is 3+ characters
        && username.charAt(0).toLowerCase() != username.charAt(0).toUpperCase() // starts with a letter
        && isAlphaNumeric(username)) // is an alphanumeric string
    {
        return true
    }
    return false
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true
    }
    return false
}

function validateLoginForm(username, password) {
    const validUsername = validateUsername(username)
    const validPassword = validatePassword(password)
    return [validUsername, validPassword]
}

function validateRegisterForm(username, email, password, conf_password) {
    const validUsername = validateUsername(username)
    const validEmail = validateEmail(email)
    const validPassword = validatePassword(password)
    const equalPasswords = (password === conf_password)
    return [validUsername, validEmail, validPassword, equalPasswords]
}

function handleLogin(username, password, setCookie) {

    const loginValidation = validateLoginForm(username, password)
    let allGood = true

    if (!loginValidation[0] || !loginValidation[1]) {
        allGood = false
        document.getElementById("loginWarning").style.display = 'block'
    }

    if (allGood) {
        document.getElementById("loginWarning").style.display = 'none'

        const user = {
            username: username,
            password: password
        }

        axios.post(`http://127.0.0.1:8000/users/login/`, user)
            .then(res => {
                console.log(res);
                if (res.data === 'login_success') {
                    setCookie('logged_user', username, {path: '/'})
                    // select_game
                    window.location.href = '../select_game'
                }
                else if (res.data === 'login_failure') {
                    document.getElementById("loginWarning").style.display = 'block'
                    setCookie('logged_user', '', {path: '/'})
                }
            })
    }

}

function handleRegister(username, email, password, conf_password, setCookie) {

    let allGood = true
    const registerValidation = validateRegisterForm(username, email, password, conf_password)

    if (!registerValidation[0]) {
        allGood = false
        document.getElementById("registerUsernameWarning").style.display = 'block'
    }
    if (!registerValidation[1]) {
        allGood = false
        document.getElementById("registerEmailWarning").style.display = 'block'
    }
    if (!registerValidation[2]) {
        allGood = false
        document.getElementById("registerPasswordWarning").style.display = 'block'
    }
    if (!registerValidation[3]) {
        allGood = false
        document.getElementById("registerConfPasswordWarning").style.display = 'block'
    }

    if (allGood) {

        document.getElementById("registerUniqueUsernameWarning").style.display = 'none'
        document.getElementById("registerUsernameWarning").style.display = 'none'
        document.getElementById("registerEmailWarning").style.display = 'none'
        document.getElementById("registerPasswordWarning").style.display = 'none'
        document.getElementById("registerConfPasswordWarning").style.display = 'none'

        const user = {
            username: username,
            email: email,
            password: password
        }

        axios.post(`http://127.0.0.1:8000/users/register/`, user)
            .then(res => {
                console.log(res.data);
                if (res.data === 'register_success') {
                    setCookie('logged_user', username, {path: '/'})
                    window.location.href = '../select_game'
                }
                else if (res.data === 'username_already_in_use') {
                    document.getElementById("registerUniqueUsernameWarning").style.display = 'block'
                    setCookie('logged_user', '', {path: '/'})
                }
            })

    }

}

function Login() {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [cookies, setCookie] = useCookies(['logged_user'])
    // setCookie('logged_user', '', {path: '/'})
    console.log("cookies: " + cookies.logged_user)

    return (
        <Container>
            <Row>
                <Col xs={5} style={{ padding: "50px" }}>
                    <SmallerTitle title="Login" />
                    {/* onSubmit={() => { handleLogin(loginUsername, loginPassword) }} */}
                    <Form onSubmit={() => { handleLogin(loginUsername, loginPassword) }} >
                        <Form.Group className="mb-3" id="loginUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username" onChange={(e) => { setLoginUsername(e.target.value) }} />
                        </Form.Group>

                        <Form.Group className="mb-3" id="loginPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { setLoginPassword(e.target.value) }} />
                            <Form.Text className="text-muted" id="loginWarning" style={{ display: 'none' }}>
                                Your login credentials are incorrect.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" id="loginRemember">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <div style={{ textAlign: "center" }}>
                            {/* type="submit" */}
                            <Button variant="primary" onClick={() => {
                                handleLogin(loginUsername, loginPassword, setCookie)
                                // console.log("logged in: " + cookies.logged_user)
                            }}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={2}>
                    <div className="vl"></div>
                </Col>
                <Col xs={5} style={{ padding: "50px" }}>
                    <SmallerTitle title="Register" />
                    <Form>
                        <Form.Group className="mb-3" id="registerUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username" onChange={(e) => { setRegisterUsername(e.target.value) }} />
                            <Form.Text className="text-muted" id="registerUniqueUsernameWarning" style={{ display: 'none' }}>
                                Your username must be unique.<br />
                            </Form.Text>
                            <Form.Text className="text-muted" id="registerUsernameWarning" style={{ display: 'none' }}>
                                Your username must have a minimum of 3 characters, start with a letter and contain only letters and numbers.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" id="registerEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => { setRegisterEmail(e.target.value) }} />
                            <Form.Text className="text-muted" id="registerEmailWarning" style={{ display: 'none' }}>
                                You must enter a valid e-mail address.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" id="registerPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { setRegisterPassword(e.target.value) }} />
                            <Form.Text className="text-muted" id="registerPasswordWarning" style={{ display: 'none' }}>
                                Your password must have a minimum of 8 characters and contain both lowercase and uppercase letters, at least one
                                digit and at least one non-alphanumeric character.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" id="registerConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => { setRegisterConfirmPassword(e.target.value) }} />
                            <Form.Text className="text-muted" id="registerConfPasswordWarning" style={{ display: 'none' }}>
                                Your password confirmation is different from your initial password.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" id="registerRemember">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <div style={{ textAlign: "center" }}>
                            <Button variant="primary" onClick={() => {
                                handleRegister(registerUsername, registerEmail, registerPassword, registerConfirmPassword, setCookie)
                                // console.log("registered: " + cookies.logged_user)
                            }}>
                                Submit
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Login