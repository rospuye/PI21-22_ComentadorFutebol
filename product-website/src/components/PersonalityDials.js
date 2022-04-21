import React, {Component} from 'react';
import { Link } from "react-router-dom";

import './components_css/PersonalityDials.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

function PersonalityDials(props) {
    return <Container className="text-center" style={{ marginTop: '10%' }}>
                <Row className="dialRow">
                    <Form.Label>Gender</Form.Label>
                    <Col>
                        <ButtonGroup aria-label="Basic example">
                            {/* className="genderChoiceSelected" */}
                            <Button variant="primary">Male</Button>
                            <Button variant="light">Female</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row className="dialRow">
                    <Col><Form.Label>Energetic</Form.Label></Col>
                    <Col><Form.Range /></Col>
                    <Col><Form.Label>Calm</Form.Label></Col>
                </Row>
                <Row className="dialRow">
                    <Col><Form.Label>Aggressive</Form.Label></Col>
                    <Col><Form.Range /></Col>
                    <Col><Form.Label>Friendly</Form.Label></Col>
                </Row>
                <Row className="dialRow">
                    <Form.Label>Bias</Form.Label>
                    <Col><Form.Label>Team A</Form.Label></Col>
                    <Col><Form.Range /></Col>
                    <Col><Form.Label>Team B</Form.Label></Col>
                </Row>
                <Row className="dialRow">
                    <Link to="/another_page">
                        <Button variant="success" size="lg">Start <FontAwesomeIcon icon={faPlay} /></Button>
                    </Link>
                </Row>
            </Container>;
}

export default PersonalityDials;