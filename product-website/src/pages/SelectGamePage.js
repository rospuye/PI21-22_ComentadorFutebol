import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'
import Select from 'react-select'

import '../components/components_css/Form.css';

import VideoGrid from '../components/VideoGrid'

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import FocoNavbar from '../components/FocoNavbar';
import ParticlesBg from 'particles-bg';

import { useCookies } from 'react-cookie';

function SelectGamePage() {

    const [cookies, setCookie] = useCookies(['logged_user'])
    const [login, setLogin] = useState(cookies.logged_user !== '');

    return (
        <>
            {/* <Link to="/">
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
            </Link>
            <Title title='FoCo' subtitle="Select Your Game" /> */}
        <div className='particlesBG'>
            <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
        </div>
        <div style={{ padding: '1%' }}>
            <Container>
                <FocoNavbar goesBack={true} backPage={"/"} hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
            </Container>

            <Container>
                <Row>
                    <Col>
                        <Title title="FoCo" subtitle="Select Your Game" ></Title>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
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
                        <Row style={{display:'flex',alignItems:'center',justifyContent:'right',marginTop:'2%',marginBottom:'3%'}}>
                            <Container style={{width:'60%',marginLeft:'30%'}}>
                                <SortInput />
                            </Container>
                        </Row>
                        <Row style={{ marginTop: '20px' }}>
                        <VideoGrid login={false} yourGames={false}/>
                        </Row>
                    </Col>
                </Row>
            </Container>
            </div>
        </>
    )
}

export default SelectGamePage