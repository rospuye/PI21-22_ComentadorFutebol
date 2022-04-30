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

function ConnectToSimulatorPage() {
    return (
        <div style={{ padding: '1%' }}>
            <Link to="/select_game">
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
            </Link>
            <Title title="Commentator" subtitle="Connect To Simulator"></Title>

            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <Form style={{marginTop: '5%'}}>
                            <Form.Group className="mb-3" controlId="formIPAddress">
                                <Form.Label>IP Address:</Form.Label>
                                <Form.Control placeholder="Enter IP address" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Port:</Form.Label>
                                <Form.Control placeholder="Enter port" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox"></Form.Group>
                            <div style={{textAlign:"center", marginTop: '5%'}}>
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