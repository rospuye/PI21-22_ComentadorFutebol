import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Pagination } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'
// import Select from 'react-select'

import '../components/components_css/Form.css';

import VideoGrid from '../components/VideoGrid'

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import FocoNavbar from '../components/FocoNavbar';
import MyPagination from '../components/Pagination';
import ParticlesBg from 'particles-bg';

import { useCookies } from 'react-cookie';

import axios from 'axios'

function SelectGamePage() {

    const [cookies, setCookie] = useCookies(['logged_user'])
    const [login, setLogin] = useState(cookies.logged_user !== '');

    const [selectedLeague, setSelectedLeague] = useState("")
    const [selectedUser, setSelectedUser] = useState("")
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedRound, setSelectedRound] = useState("")
    const [selectedGroup, setSelectedGroup] = useState("")
    const [selectedTitle, setSelectedTitle] = useState("")
    const [selectedPage, setSelectedPage] = useState(1)


    const [games, setGames] = useState([])

    const requestGame = () => {
        let url = process.env.REACT_APP_API_URL + `games?page=` + selectedPage + `&`

        if (selectedTitle != "") {
            url += `title=${selectedTitle}&`
        }

        if (selectedLeague != "") {
            url += `league=${selectedLeague}&`
        }

        if (selectedUser != "") {
            url += `username=${selectedUser}&`
        }

        if (selectedYear != "") {
            url += `year=${selectedYear}&`
        }

        if (selectedRound != "") {
            url += `round=${selectedRound}&`
        }

        if (selectedGroup != "") {
            url += `matchGroup=${selectedGroup}`
        }

        console.log("URL: ", url);

        axios.get(url)
            .then(res => {
                // console.log(res.data)
                setGames(res.data.results)
            })
    }

    const updateLogin = () => {
        setLogin(cookies.logged_user !== '')
        window.location.reload()
    }

    useEffect(() => {
        requestGame()
    }, [])


    return (
        <>
            {/* <Link to="/">
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
            </Link>
            <Title title='FoCo' subtitle="Select Your Game" /> */}
            <div className='particlesBG'>
                <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'} />
            </div>
            <div style={{ padding: '1%' }}>
                <Container>
                    <FocoNavbar goesBack={true} backPage={"/"} hasLoginBtn={true} cookies={cookies} setCookie={setCookie} updateLogin={updateLogin} />
                </Container>

                <Container>
                    <Row>
                        {/* <Col>
                        <Link to="/">
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '5%', marginLeft: '2%' }} />
                        </Link>
                    </Col> */}
                        <Col>
                            <Title title="FoCo" subtitle="Select Your Game"></Title>
                        </Col>
                        {/* <Col style={{ display: 'flex', justifyContent: 'right' }}>
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
                    </Col> */}
                    </Row>
                </Container>

                <Container>
                    <Row style={{ marginTop: '3%' }}>
                        <Col xs={3}>
                            {/* Filters and Buttons */}
                            <SearchBox
                                login={login}
                                selectedLeague={selectedLeague}
                                setSelectedLeague={setSelectedLeague}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                                selectedYear={selectedYear}
                                setSelectedYear={setSelectedYear}
                                selectedRound={selectedRound}
                                setSelectedRound={setSelectedRound}
                                selectedGroup={selectedGroup}
                                setSelectedGroup={setSelectedGroup}
                                selectedTitle={selectedTitle}
                                setSelectedTitle={setSelectedTitle}
                                requestGame={requestGame}
                            />
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
                            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', marginBottom: '3%' }}>
                                <Container style={{ width: '60%', marginLeft: '30%' }}>
                                    <SortInput />
                                </Container>
                            </Row>
                            <Row style={{ marginTop: '20px' }}>
                                <VideoGrid games={games} />
                            </Row>
                            <Row style={{ marginTop: '-20%' }}>
                                <MyPagination no_pages={6} />
                                {/* <div class="pagination" style={{display: "flex", justifyContent: "center"}}>
                                    <a>&laquo;</a>
                                    <a onClick={() => { setSelectedPage(1); requestGame(); }}>1</a>
                                    <a class="active" onClick={() => { setSelectedPage(2); requestGame(); }}>2</a>
                                    <a onClick={() => { setSelectedPage(3); requestGame(); }}>3</a>
                                    <a onClick={() => { setSelectedPage(4); requestGame(); }}>4</a>
                                    <a onClick={() => { setSelectedPage(5); requestGame(); }}>5</a>
                                    <a onClick={() => { setSelectedPage(6); requestGame(); }}>6</a>
                                    <a>&raquo;</a>
                                </div> */}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default SelectGamePage