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

import '../components/scss/button.css'
import FocoNavbar from '../components/FocoNavbar';
import ThreeJSCanvas from '../components/ThreeJSCanvas';

function MeetFoco() {
    const [cookies, setCookie] = useCookies(['logged_user'])
    console.log("cookies: " + cookies.logged_user)
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
                    <Col>
                        <ThreeJSCanvas className/>
                    </Col>
                </Row>
                <Row style={{marginTop:'5%',width:'80%',textAlign:'center'}}>
                    <Col>
                        <Button>Calm</Button>
                    </Col>
                    <Col>
                        <Button>Energetic</Button>
                    </Col>
                    <Col>
                        <Button>Agressive</Button>
                    </Col>
                    <Col>
                        <Button>Friendly</Button>
                    </Col>
                </Row>
            </Col>
            <Col className='meetFocoDescription'>
                <Row>
                <p className='meetFocoP'>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fringilla placerat tristique. Ut vel purus commodo, vulputate ipsum eget, egestas urna. Ut magna augue, rutrum a finibus in, scelerisque id urna. Integer sed consectetur ligula. Phasellus vel rutrum erat, nec scelerisque ex. Nam non leo ut nibh consectetur rhoncus. In erat mauris, mattis non massa non, sagittis gravida tortor. Fusce et dui ultrices, placerat dui vitae, finibus lectus. Suspendisse potenti. Vivamus rutrum arcu non scelerisque fringilla. Sed sit amet erat id diam sollicitudin porttitor eu rhoncus erat. Nam pulvinar massa et eleifend tempus.

Etiam dignissim sollicitudin blandit. Aenean id tincidunt velit. Pellentesque ultrices sed metus at lacinia. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae leo efficitur, faucibus elit vitae, luctus eros. Ut vehicula, felis non ultricies molestie, nunc purus vulputate orci, a fermentum justo nunc posuere felis. Nulla tristique viverra ornare. Nullam tempus orci ac nunc maximus tristique. Duis nec justo ac sem varius cursus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Nulla tincidunt urna a tristique faucibus. Nullam sed eros quis nibh bibendum tincidunt. Nulla tempus eleifend vulputate. Nam semper, justo quis cursus ultricies, lorem nisl ornare massa, non tristique sapien risus non ipsum. Nullam sed eros vitae nisi pellentesque fermentum. Vivamus egestas mauris quis porttitor vulputate. Sed augue augue, placerat at ipsum vitae, aliquam suscipit ligula. Maecenas sagittis, ante vitae gravida ultrices, ipsum erat pretium augue, tincidunt varius ipsum augue non ligula. Ut volutpat a nibh ut porttitor. Ut iaculis imperdiet mauris eu pulvinar. Nulla ante nunc, molestie lobortis purus vitae, dapibus elementum enim. Nam porttitor dictum sapien, sed pellentesque neque porta ac. Curabitur feugiat nibh in eros pellentesque, et varius felis pharetra. Nam libero lorem, accumsan quis auctor vel, cursus vitae justo. Nulla fringilla in dui eget pretium.</p>
                </Row>
            </Col>
        </Row>
    </Container>

    </div>
    </>
  )
}

export default MeetFoco