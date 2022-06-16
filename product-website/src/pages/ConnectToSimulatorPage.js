// React
import React from 'react'

// Components
import Title from '../components/Title';

// Bootstrap
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ParticlesBg from 'particles-bg'
import FocoNavbar from '../components/FocoNavbar';

// CSS
import '../components/components_css/Form.css';

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie'

function ConnectToSimulatorPage() {

    const [cookies, setCookie] = useCookies(['logged_user'])

    return (<>
        <div className='particlesBG'>
        <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA"/>
        </div>
        <div style={{ padding: '1%' }}>
        <Container>
            <FocoNavbar goesBack={true} backPage="/select_game" hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
        </Container>

            <Container>
                <Row>
                   <Title title="FoCo" subtitle="Connect To Simulator"></Title>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <Form style={{ marginTop: '5%' }}>
                            <Form.Group className="mb-3" controlId="formIPAddress">
                                <Form.Label>IP Address:</Form.Label>
                                <Form.Control placeholder="Enter IP address" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Port:</Form.Label>
                                <Form.Control placeholder="Enter port" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox"></Form.Group>
                            <div style={{ textAlign: "center", marginTop: '5%' }}>
                            <Link to="/game_viewing">
                                <Button className='btnUpload' variant="primary" type="submit" size="lg">
                                    Connect
                                </Button>
                            </Link>
                            </div>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

        </div>
        </>
    )
}

export default ConnectToSimulatorPage