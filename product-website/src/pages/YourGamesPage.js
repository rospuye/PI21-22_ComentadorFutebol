import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'

import '../components/components_css/Form.css';
import VideoGrid from '../components/VideoGrid'

import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ParticlesBg from 'particles-bg';
import FocoNavbar from '../components/FocoNavbar';


import { useCookies } from 'react-cookie'

import axios from 'axios'
import MyPagination from '../components/MyPagination'

function YourGamesPage() {

    const [cookies, setCookie] = useCookies(['logged_user'])
    const [login, setLogin] = useState(cookies.logged_user !== '');

    const [selectedLeague,setSelectedLeague] = useState("")
    const [selectedUser,setSelectedUser] = useState("")
    const [selectedYear,setSelectedYear] = useState("")
    const [selectedRound,setSelectedRound] = useState("")
    const [selectedGroup,setSelectedGroup] = useState("")
    const [selectedTitle,setSelectedTitle] = useState("")
    const [selectedPage, setSelectedPage] = useState(1)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    const [sort, setSort] = useState("")

    const [games, setGames] = useState([])

    const navigate = useNavigate();


    const requestGame = () => {
        let config = {}
        if (cookies.token != null && cookies.token !== "") {
            config = {
                headers: {
                    'content-type': 'multipart/form-data',
                    'Authorization': `Token ${cookies.token}`
                }
            }
        }
        else {
            config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
        }
        let url = process.env.REACT_APP_API_URL + `games?page=` + selectedPage + `&`

        if (selectedTitle != "") {
            url += `title=${selectedTitle}&`
        }

        if (selectedLeague != "") {
            url += `league=${selectedLeague}&`
        }

        url += `username=${cookies.logged_user}&`

        if (selectedYear != "") {
            url += `year=${selectedYear}&`
        }

        if (selectedRound != "") {
            url += `round=${selectedRound}&`
        }

        if (selectedGroup != "") {
            url += `matchGroup=${selectedGroup}`
        }

        if (sort != "") {
            url += `sort=${sort.toLowerCase()}`
        }

        // console.log("url", url)

        axios.get(url, config)
        .then(res => {
            console.log(res.data)
            setGames(res.data.results)
            setNumberOfPages(res.data.total_pages)
            setIsLoaded(true)
        })
    }
    const updateLogin = () => {
        console.log("UPDATE LOGIN WAS CALLED")
        setLogin(cookies.logged_user !== '')
        window.location.reload()
    }

    useEffect(() => {
        if (cookies.logged_user === "" || cookies.logged_user === null) {
            navigate("/")
            return
        }
        requestGame()
    }, [selectedPage, sort])

    return (
        <>
         <div className='particlesBG'>
            <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
        </div>
        <div style={{ padding: '1%' }}>
            <Container>
                <FocoNavbar goesBack={true} backPage={"/select_game"} hasLoginBtn={true} cookies={cookies} setCookie={setCookie} updateLogin={updateLogin}/>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <Title title="FoCo" subtitle="Your Games"></Title>
                    </Col>
                </Row>
            </Container>

            {isLoaded ?
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
                        </Col>
                        <Col xs={9}>
                            <Row style={{display:'flex',alignItems:'center',justifyContent:'right',marginBottom:'3%'}}>
                                <Container style={{width:'60%',marginLeft:'30%'}}>
                                    <SortInput 
                                        sort={sort}
                                        setSort={setSort}
                                    />
                                </Container>
                            </Row>
                            <Row style={{ marginTop: '20px' }}>
                                <VideoGrid 
                                    // login={true} 
                                    // yourGames={true}
                                    games={games}
                                    isEditable
                                />
                            </Row>
                            <Row>
                                {games.length !== 0 ?
                                <MyPagination
                                    n_pages={numberOfPages}
                                    selPage={selectedPage}
                                    setSelPage={setSelectedPage}
                                />
                                :
                                <></>}
                            </Row>
                            {/* <VideoGrid games={null}/>
                            Grid with videos and pages */}
                        </Col>
                    </Row>
                </Container>
            :
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10em"}}>
                    <Spinner animation={"border"} variant={"primary"} />
                </div>
            }
            </div>
        </>
    )
}

export default YourGamesPage