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
import {Navbar,Nav,NavDropdown} from 'react-bootstrap'
// import Nav from 'react-bootstrap/Navbar'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import Img from '../images/graphic_model.PNG'

import { useCookies } from 'react-cookie'
import ParticlesBg from 'particles-bg'
import ThreeJSCanvas from '../components/ThreeJSCanvas';

import '../components/scss/button.css'
import FocoNavbar from '../components/FocoNavbar';

function Homepage() {

  let intro = "Automatic system for natural language commentary of robotic football games.";
  const [cookies, setCookie] = useCookies(['logged_user', 'token'])
  console.log("logged_user: " + cookies.logged_user)
  console.log("token: " + cookies.token)

  return (
    <>
    {/* //cobweb is cool */}
    <div className='particlesBG'>
      <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
    </div>
    <div style={{ padding: '1%' }}>
    <Container>
      <FocoNavbar goesBack={false} hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
    </Container>

    <Title title="FoCo: Football Commentator" subtitle={intro}></Title>

    <Container>
      <Row>
        <Col style={{paddingTop:'5%'}}>
          <ThreeJSCanvas/>
        </Col>
        <Col>
          <div style={{ width: '100%',  paddingTop: '20%', textAlign:"center" }}>
            <p className='homepageP'><b>Enjoy the Experience!</b></p>
            <Link to="/select_game">
              <button className="learn-more">
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Start</span>
              </button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
  </>);
}

export default Homepage;
