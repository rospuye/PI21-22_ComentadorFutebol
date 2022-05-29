// React
import React, { useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

// Components
import JasminPlayer from '../components/JasminPlayer'
import ThreeJSCanvas from '../components/ThreeJSCanvas'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import ParticlesBg from 'particles-bg';
import FocoNavbar from '../components/FocoNavbar';

import axios from 'axios';

function GameViewingPage() {

    let { id, gender, energy, aggressiveness, bias } = useParams();
    const [cookies, setCookie] = useCookies(['logged_user'])

    console.log("game_id", id)
    console.log("gender: " + gender)
    console.log("energy: " + energy)
    console.log("aggressiveness: " + aggressiveness)
    console.log("bias: " + bias)

    const requestGame = () => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Token ${cookies.token}`
                // 'Access-Control-Allow-Origin': 'http://localhost:3001'
            },
        };

        let url = `${process.env.REACT_APP_API_URL}generate_script/${id}?en_calm_mod=${energy}&agr_frnd_mod=${aggressiveness}&bias=${bias}`

        console.log("Get request")

        axios.get(url, config)
            .then(res => {
                console.log(res)
                // setGames(res.data)
            })
    }

    useEffect(() => {
        requestGame()
    })

    return (
        <>
            <div className='particlesBG'>
                <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'} />
            </div>
            <div style={{ padding: '1%' }}>
                <Container>
                    <FocoNavbar goesBack={false} hasLoginBtn={true} cookies={cookies} setCookie={setCookie} />
                </Container>

                <Container>
                    <Row style={{marginTop:'2%'}}>
                        <Col>
                            <h3 className='gameViewTitle'>Game Viewing</h3>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'right' }}>
                            <Link to="/statistics">
                                <button className="learn-more">
                                    <span className="circle" aria-hidden="true">
                                        <span className="icon arrow"></span>
                                    </span>
                                    <span className="button-text">Skip to End</span>
                                </button>
                            </Link>
                        </Col>
                    </Row>
                    <Row style={{marginTop: '3%' }}>
                        <Col>
                            <JasminPlayer />
                        </Col>
                        <Col>
                            <ThreeJSCanvas />
                            <ToastContainer style={{ marginTop: '2%', width: '100%' }}>
                                <Toast style={{ width: '100%', height: '300px', overflowY: 'scroll' }}>
                                    <Toast.Body>
                                        00:00 - Lorem Ipsum<br />
                                        00:23 - Ball ball ball<br />
                                        00:32 - AAAAAAAAA<br />
                                        01:01 - MAMA MIA<br />
                                    </Toast.Body>
                                </Toast>
                            </ToastContainer>
                        </Col>
                    </Row>
                </Container>

            </div>
        </>)
}

export default GameViewingPage;