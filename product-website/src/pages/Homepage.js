// React
import React from 'react';
import { Link } from "react-router-dom";

// Components
import Title from '../components/Title';

// Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import Img from '../images/graphic_model.PNG'

import { useCookies } from 'react-cookie'

function Homepage() {

  let intro = "Automatic system for natural language commentary of robotic football games.";
  const [cookies, setCookie] = useCookies(['logged_user'])
  console.log("cookies: " + cookies.logged_user)

  return (<div style={{ padding: '1%' }}>

    <Container>
      <Row>
        <Col></Col>
        <Col></Col>
        <Col xs lg="2">
          {/* || cookies.logged_user == undefined */}
          {(cookies.logged_user !== '') ?
            <Button variant="light" onClick={() => {
              setCookie('logged_user', '', { path: '/' })
            }}>Logout</Button>
            :
            <Link to="/login">
              <Button variant="light">Login/Register</Button>
            </Link>
          }
        </Col>
      </Row>
    </Container>

    <Title title="FoCo: Football Commentator" subtitle={intro}></Title>

    <Container>
      <Row>
        <Col>
          <div style={{ width: '100%', 'paddingLeft': '10%', paddingTop: '5%' }}>
            <img
              alt='Robot Model'
              src={Img}
              className='img-thumbnail'
              style={{ maxWidth: '24rem', marginLeft: '10%', marginTop: '2%' }}
            />
          </div>
        </Col>
        <Col>
          <div style={{ width: '100%', paddingLeft: '25%', paddingTop: '20%' }}>
            <Link to="/select_game">
              <Button variant="success" size="lg">Start <FontAwesomeIcon icon={faPlay} /></Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>

  </div>);
}

export default Homepage;
