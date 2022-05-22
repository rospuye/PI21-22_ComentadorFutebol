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

    const script = [
        {"start": 3.1, "end": 8.3, "text": "Not implemented yet"},
        {"start": 8.34, "end": 9.10002, "text": "matNum4matLeft has the ball!"},
        {"start": 12.2601, "end": 12.2601, "text": "and the games goes on"},
        {"start": 12.3001, "end": 13.8201, "text": "Not implemented yet :)"},
        {"start": 13.8601, "end": 16.5002, "text": "matNum5matLeft has the ball!"},
        {"start": 16.5002, "end": 16.5002, "text": "intersected the ball"},
        {"start": 16.5402, "end": 18.6202, "text": "Not implemented yet :)"},
        {"start": 18.6602, "end": 20.3003, "text": "matNum3matRight has the ball!"},
        {"start": 20.3003, "end": 20.3003, "text": "intersected the ball"},
        {"start": 20.7403, "end": 21.1803, "text": "matNum5matLeft and matNum3matRight fall down"},
        {"start": 20.3403, "end": 22.3803, "text": "Not implemented yet :)"},
        {"start": 22.1003, "end": 22.5803, "text": "matNum4matLeft and matNum8matRight fall down"},
        {"start": 22.4203, "end": 25.2204, "text": "matNum3matLeft has the ball!"},
        {"start": 25.7804, "end": 25.8204, "text": "matNum3matLeft has the ball!"},
        {"start": 25.8604, "end": 25.9004, "text": "matNum3matLeft has the ball!"},
        {"start": 26.2604, "end": 27.5804, "text": "matNum3matLeft is racing through the field"},
        {"start": 27.5804, "end": 27.5804, "text": "intersected the ball"},
        {"start": 27.6204, "end": 27.9804, "text": "matNum3matRight is racing through the field"},
        {"start": 27.9804, "end": 27.9804, "text": "intersected the ball"},
        {"start": 28.0205, "end": 28.0605, "text": "matNum3matLeft is racing through the field"},
        {"start": 28.0605, "end": 28.0605, "text": "intersected the ball"},
        {"start": 28.1005, "end": 28.1405, "text": "matNum3matLeft has the ball!"},
        {"start": 28.1405, "end": 28.1405, "text": "intersected the ball"},
    ]




    return (
        <div>

            <Container fluid >
                <Row>
                    <Col>
                        <Link to="/">
                            <FontAwesomeIcon icon={faHouse} style={{ color: 'white', fontSize: '30px', marginTop: '40px', marginLeft: '40px' }} />
                        </Link>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        <Link to="/statistics">
                            <FontAwesomeIcon icon={faArrowRight} style={{ color: 'white', fontSize: '30px', marginTop: '40px', marginRight: '40px' }} />
                        </Link>
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


        </div>)
}

export default GameViewingPage;