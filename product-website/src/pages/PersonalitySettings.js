// React
import React, { useState } from 'react';
import { Link, useParams } from "react-router-dom";

// Components
import Title from '../components/Title';
import PersonalityDials from '../components/PersonalityDials';
import Avatar from '../components/Avatar';

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import Img from '../images/graphic_model.PNG'
import Img2 from '../images/plus.PNG'

import axios from 'axios'
import { useCookies } from 'react-cookie'

import ParticlesBg from 'particles-bg'
import FocoNavbar from '../components/FocoNavbar';

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

  const [login, setLogin] = useState(true)
  const [gender, setGender] = useState("Male")
  const [energy, setEnergy] = useState(0)
  const [aggressiveness, setAggressiveness] = useState(0)
  const [team, setTeam] = useState(0)

  const [cookies, setCookie] = useCookies(['logged_user'])

  let { game_id } = useParams();


  const createPreset = () => {

    const url = process.env.REACT_APP_API_URL + 'presets/';

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': `Token ${cookies.token}`
        // 'Access-Control-Allow-Origin': 'http://localhost:3001'
      },
    };

    const formData = new FormData()
    formData.append("gender", gender)
    formData.append("aggressive_val", aggressiveness)    
    formData.append("energetic_val", energy)
    formData.append("bias", team)
    console.log("preset create start")
    axios.post(url, formData, config).then((response) => {
      console.log("preset create response", response)

      document.getElementById('confirmBtn').disabled = false;
      // setLoading(false)
    });
  }

  return (

    cookies.logged_user !== '' ?

      <div>

        <Container>
          <Row>
            <Col>
              <Link to="/select_game">
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '5%', marginLeft: '2%' }} />
              </Link>
            </Col>
            <Col>
              <Title title="FoCo" subtitle="Personality Settings"></Title>
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'right' }}>
              <Button variant="light" style={{ height: '40px', marginTop: '5%' }} onClick={() => {
                setCookie('logged_user', '', { path: '/' })
                setCookie('token', '', {path: '/'})
              }}>Logout</Button>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col><h4 className='titleH4'>Ready-made presets</h4></Col>
            <Col xs={6}></Col>
            <Col><h4 className='titleH4'>Your presets</h4></Col>
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

            <Col xs={6}><PersonalityDials
              game_id={game_id}
              gender={gender}
              setGender={setGender}
              energy={energy}
              setEnergy={setEnergy}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              bias={team}
              setBias={setTeam}
              createPreset={createPreset}
            /></Col>

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


        // {/* <Container>
        //   <Row>
        //     <Col>
        //       <Link to="/select_game">
        //         <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '10%', marginLeft: '2%' }} />
        //       </Link>
        //     </Col>
        //     <Col>
        //       <Title title="FoCo" subtitle="Personality Settings"></Title>
        //     </Col>
        //     <Col style={{ display: 'flex', justifyContent: 'right' }}></Col>
        //   </Row>
        // </Container> */}
<>
<div className='particlesBG'>
        <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" />
      </div>
      <div style={{ padding: '1%' }}>
        <Container>
          <FocoNavbar goesBack={true} backPage="/select_game" hasLoginBtn={true} cookies={cookies} setCookie={setCookie} />
        </Container>

        <Container>
          <Row>
            <Col>
              <Title title="FoCo" subtitle="Personality Settings"></Title>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row style={{marginTop:'5%'}}>
            <Col className="text-center">
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

            <Col xs={6}><PersonalityDials
              game_id={game_id}
              gender={gender}
              setGender={setGender}
              energy={energy}
              setEnergy={setEnergy}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              bias={team}
              setBias={setTeam}
              createPreset={createPreset}
            /></Col>

            <Col className="text-center">
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

          </Row>
        </Container>

      </div>
      </>

  );

}

export default PersonalitySettings;
