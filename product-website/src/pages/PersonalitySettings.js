// React
import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Components
import Title from '../components/Title';
import PersonalityDials from '../components/PersonalityDials';
import Avatar from '../components/Avatar';

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import Img from '../images/graphic_model.PNG'
import Img2 from '../images/plus.PNG'

function PersonalitySettings() {

  const dummyRobots = [
    { alt: "Robot Model 1", src: { Img } },
    { alt: "Robot Model 2", src: { Img } },
    { alt: "Robot Model 3", src: { Img } }
  ];

  const dummyRobots2 = [
    { alt: "Robot Model 1", src: { Img } },
    { alt: "Robot Model 2", src: { Img2 } }
  ];

  const [login, setLogin] = useState(true);

  return (

    login ?

      <div>
        
        <Link to="/select_game">
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
        </Link>

        <Title title="Commentator" subtitle="Personality Settings" style={{ marginTop: '-5%' }}></Title>

        <Container>
          <Row>
            <Col><h4>Ready-made presets</h4></Col>
            <Col xs={6}></Col>
            <Col><h4>Your presets</h4></Col>
          </Row>
          <Row>
            <Col>
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>
            <Col>
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

            <Col xs={6}><PersonalityDials /></Col>

            <Col>
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>
            <Col>
              {
                dummyRobots2.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

          </Row>
        </Container>
      </div>

      :

      <div>

        <Link to="/select_game">
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
        </Link>

        <Title title="Commentator" subtitle="Personality Settings" style={{ marginTop: '-5%' }}></Title>

        <Container>
          <Row>
            <Col className="text-center mt-4 mb-4">
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

            <Col xs={6}><PersonalityDials /></Col>

            <Col className="text-center mt-4 mb-4">
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

          </Row>
        </Container>

      </div>

  );

}

export default PersonalitySettings;
