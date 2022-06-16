import React, {useState} from 'react';
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

import '../components/scss/button.css'
import FocoNavbar from '../components/FocoNavbar';
import ThreeJSCanvas from '../components/ThreeJSCanvas';

function MeetFoco() {

    const [cookies, setCookie] = useCookies(['logged_user'])

    const [fstate, setFstate] = useState("f_neutral");
    const [cstate, setCstate] = useState("c_neutral");

  return (
    <>
    <div className='particlesBG'>
      <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
    </div>
    <div style={{ padding: '1%' }}>
    <Container>
      <FocoNavbar goesBack={false} hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
    </Container>

    <h2 className='titleH3'>Meet FoCo</h2>

    <Container>
        <Row style={{marginTop:'5%'}}>
            <Col>
                <Row>
                    <Col style={{paddingLeft:'5%',paddingRight:'5%'}}>
                        <ThreeJSCanvas fstate={fstate} cstate={cstate} />
                    </Col>
                </Row>
                <Row style={{marginTop:'5%',width:'100%',textAlign:'center',paddingLeft:'5%',paddingRight:'5%'}}>
                    <Col style={{marginBottom:'5%'}}>
                        <Button className="meetFocoButton focoButton1" onClick={() => {setCstate("calm")}}>Calm</Button>
                    </Col>
                    <Col style={{marginBottom:'5%'}}>
                        <Button className="meetFocoButton focoButton2" onClick={() => {setCstate("c_neutral")}}>Neutral</Button>
                    </Col>
                    <Col style={{marginBottom:'5%'}}>
                        <Button className="meetFocoButton focoButton3" onClick={() => {setCstate("energetic")}}>Energetic</Button>
                    </Col>
                </Row>

                <Row style={{marginTop:'5%',width:'100%',textAlign:'center',paddingLeft:'5%',paddingRight:'5%'}}>
                    <Col style={{marginBottom:'5%'}}>
                        <Button className="meetFocoButton focoButton4" onClick={() => {setFstate("aggressive")}}>Agressive</Button>
                    </Col>
                    <Col style={{marginBottom:'5%'}}>
                        <Button className="meetFocoButton focoButton2" onClick={() => {setFstate("f_neutral")}}>Neutral</Button>
                    </Col>
                    <Col style={{marginBottom:'5%'}}>
                        <Button className="meetFocoButton focoButton6" onClick={() => {setFstate("friendly")}}>Friendly</Button>
                    </Col>
                </Row>
            </Col>
            <Col className='meetFocoDescription' style={{marginLeft:'5%',marginRight:'5%',height:'50%'}}>
                <Row>
                <p className='meetFocoP'>
                    Hi! I'm Foco, the Football Commentator mascot.
                    <br/>I was created to comment my friends' games to you.
                    <br/>
                    I can be Calm, Energetic or just Neutral, it depends of the day (and of your decision).
                    <br/>I can also be Aggressive, Neutral or Friendly.
                    <br/>Try to mix those settings with the buttons below and see how my mood changes!
                    <br/>Don't overuse it though, because even though I'm a robot I still have feelings &#128516;
                </p>
                </Row>
            </Col>
        </Row>
    </Container>

    </div>
    </>
  )
}

export default MeetFoco