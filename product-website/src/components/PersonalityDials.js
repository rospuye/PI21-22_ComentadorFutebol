import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import './components_css/PersonalityDials.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import RangeSlider from 'react-bootstrap-range-slider';

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

function PersonalityDials({gender, setGender, energy, setEnergy, aggressiveness,
    setAggressiveness, bias, setBias, createPreset, game_id}) {
              
    const navigate = useNavigate();
    let { id } = useParams();

    function goToGameViewing() {
        console.log(id)
        navigate('/game_viewing/' + id + '/' + gender + '/' + energy + '/' + aggressiveness + '/' + bias,
            { state: {
                game_id: game_id,
                gender: gender,
                energy: energy,
                aggressiveness: aggressiveness,
                bias: bias
            },
            test: 'amogus' });
    }

    return <Container className="text-center" style={{ marginTop: '10%' }}>
        <Row className="dialRow">
            <Form.Label>Gender</Form.Label>
            <Col>
                <ButtonGroup aria-label="Basic example">
                    {/* className="genderChoiceSelected" */}
                    <Button variant={gender == "Male" ? "primary" : "light"} onClick={() => { setGender("Male") }}>Male</Button>
                    <Button variant={gender == "Female" ? "primary" : "light"} onClick={() => { setGender("Female") }}>Female</Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row className="dialRow">
            <Col><Form.Label>Energetic</Form.Label></Col>
            {/* <Col><Form.Range /></Col> */}
            <RangeSlider
                value={energy}
                onChange={e => setEnergy(e.target.value)}
                min={-50}
                max={50}
            />
            <Col><Form.Label>Calm</Form.Label></Col>
        </Row>
        <Row className="dialRow">
            <Col><Form.Label>Aggressive</Form.Label></Col>
            <RangeSlider
                value={aggressiveness}
                onChange={e => setAggressiveness(e.target.value)}
                min={-50}
                max={50}
            />
            <Col><Form.Label>Friendly</Form.Label></Col>
        </Row>
        <Row className="dialRow">
            <Form.Label>Bias</Form.Label>
            <Col><Form.Label>Team A</Form.Label></Col>
            <RangeSlider
                value={bias}
                onChange={e => setBias(e.target.value)}
                min={-1}
                max={1}
            />
            <Col><Form.Label>Team B</Form.Label></Col>
        </Row>
        <Row className="dialRow">
            <Button variant="success" size="lg" onClick={goToGameViewing}>Start <FontAwesomeIcon icon={faPlay} /></Button>
        </Row>

        <Button variant="success" size="lg" onClick={() => createPreset()}>Create <FontAwesomeIcon icon={faPlay} /></Button>
    </Container>;
}

export default PersonalityDials;