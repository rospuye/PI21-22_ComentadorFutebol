// React
import React from 'react'
import { Link } from "react-router-dom"

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

function GameViewingPage() {
    return (
        <div>

            <Container fluid >
                <Row>
                    <Col>
                        <Link to="/another_page">
                            <FontAwesomeIcon icon={faHouse} style={{ color: 'white', fontSize: '30px', marginTop: '20px', marginLeft: '20px' }} />
                        </Link>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        <Row style={{ width: '33%' }}>
                            <Col>
                                <Link to="/another_page" style={{ textDecoration: 'none' }}>
                                    <h5 style={{ color: 'white', marginTop: '20px', marginRight: '20px' }}>Skip to end</h5>
                                </Link>
                            </Col>
                            <Col>
                                <Link to="/another_page">
                                    <FontAwesomeIcon icon={faArrowRight} style={{ color: 'white', fontSize: '30px', marginTop: '20px', marginRight: '20px' }} />
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ marginLeft: '5%', marginTop: '5%' }}>
                        <JasminPlayer />
                    </Col>
                    <Col>
                        <ThreeJSCanvas />
                        <ToastContainer style={{ marginTop: '2%', width: '100%' }}>
                            <Toast style={{ width: '80%', height: '300px', overflowY: 'scroll' }}>
                                <Toast.Body>
                                    00:00 - Lorem Ipsum<br/>
                                    00:23 - Ball ball ball<br/>
                                    00:32 - AAAAAAAAA<br/>
                                    01:01 - MAMA MIA<br/>
                                </Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                </Row>
            </Container>


        </div>)
}

export default GameViewingPage;