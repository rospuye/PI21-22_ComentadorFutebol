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

// CSS
import '../components/components_css/Form.css';

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie'

function ConnectToSimulatorPage() {

    const [cookies, setCookie] = useCookies(['logged_user'])

    return (
        <div style={{ padding: '1%' }}>

            <Container>
                <Row>
                    <Col>
                        <Link to="/select_game">
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '10%', marginLeft: '2%' }} />
                        </Link>
                    </Col>
                    <Col>
                        <Title title="FoCo" subtitle="Connect To Simulator"></Title>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        {cookies.logged_user !== '' ?
                            <Button variant="light" style={{ height: '40px', marginTop: '5%' }} onClick={() => {
                                setCookie('logged_user', '', { path: '/' })
                                window.location.href = '../select_game'
                            }}>Logout</Button>
                            :
                            <></>
                        }
                    </Col>
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
                                <Button variant="primary" type="submit" size="lg" className="formBtn">
                                    Connect
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

        </div>
    )
}

export default ConnectToSimulatorPage