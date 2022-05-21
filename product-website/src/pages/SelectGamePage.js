import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'

import '../components/components_css/Form.css';
import VideoGrid from '../components/VideoGrid'

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie';

import axios from 'axios'

function SelectGamePage() {

    const [cookies, setCookie] = useCookies(['logged_user'])
    const [login, setLogin] = useState(cookies.logged_user !== '');

    axios.get(process.env.REACT_APP_API_URL + `games`)
        .then(res => {
            console.log(res);
            // if (res.data.message === 'register_success') {
            //     setCookie('logged_user', username, { path: '/', maxAge: '3600' })
            //     setCookie('token', res.data.token, { path: '/', maxAge: '3600' })

            //     console.log("logged_user: " + cookies.logged_user)
            //     console.log("token: " + cookies.token)

            //     window.location.href = '../select_game'
            // }
            // else if (res.data.message === 'username_already_in_use') {
            //     document.getElementById("registerUniqueUsernameWarning").style.display = 'block'
            //     setCookie('logged_user', '', { path: '/' })
            //     setCookie('token', '', { path: '/' })
            // }
        })

    return (
        <>
            {/* <Link to="/">
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
            </Link>
            <Title title='FoCo' subtitle="Select Your Game" /> */}

            <Container>
                <Row>
                    <Col>
                        <Link to="/">
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '5%', marginLeft: '2%' }} />
                        </Link>
                    </Col>
                    <Col>
                        <Title title="FoCo" subtitle="Select Your Game"></Title>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        {login ?
                            <Button variant="light" style={{ height: '40px', marginTop: '5%' }} onClick={() => {
                                setCookie('logged_user', '', { path: '/' })
                                setCookie('token', '', { path: '/' })
                                setLogin(cookies.logged_user !== '')
                                window.location.reload()
                            }}>Logout</Button>
                            :
                            <></>
                        }
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <SortInput />
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col xs={3}>
                        {/* Filters and Buttons */}
                        <SearchBox login={login} />
                        {login ?
                            <div className='searchBoxDiv'>
                                <Link to="/your_games">
                                    <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Your Games</Button>
                                </Link>
                                <Link to="/upload">
                                    <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Upload Your Game</Button>
                                </Link>
                                <Link to="/simulator">
                                    <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Connect to Simulator</Button>
                                </Link>
                            </div>
                            : <></>}
                    </Col>
                    <Col xs={9}>
                        <VideoGrid login={false} yourGames={false} />
                        {/* Grid with videos and pages */}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default SelectGamePage