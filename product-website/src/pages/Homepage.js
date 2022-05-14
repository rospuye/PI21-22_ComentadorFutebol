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

function Homepage() {

  let intro = "Automatic system for natural language commentary of robotic football games.";
  const [cookies, setCookie] = useCookies(['logged_user'])
  console.log("cookies: " + cookies.logged_user)

  return (<div style={{ padding: '1%' }}>
    {/* //cobweb is cool */}
    <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA"/>
    {/* 764DC7 */}
    {/* <Container>
      <Row>
        <Col></Col>
        <Col></Col>
        <Col xs lg="2">
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
    </Container> */}
    <Container>
      <Navbar style={{borderRadius:"15px"}} collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="/"><b>FoCo</b></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="https://isabelrosario8.wixsite.com/foco">About</Nav.Link>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
          {(cookies.logged_user !== '') ?
            <Button variant="light" onClick={() => {
              setCookie('logged_user', '', { path: '/' })
            }}>Logout</Button>
            :
            <Link to="/login">
              <Button className='loginButton' variant="light">Login/Register</Button>
            </Link>
          }
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>

    <Title title="FoCo: Football Commentator" subtitle={intro}></Title>

    <Container>
      <Row>
        <Col>
          <ThreeJSCanvas/>
        </Col>
        <Col>
          <div style={{ width: '100%',  paddingTop: '20%', textAlign:"center" }}>
            <p className='homepageP'><b>Enjoy the Experience!</b></p>
            <Link to="/select_game">
              <button class="learn-more">
                <span class="circle" aria-hidden="true">
                  <span class="icon arrow"></span>
                </span>
                <span class="button-text">Start</span>
              </button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>

  </div>);
}

export default Homepage;
