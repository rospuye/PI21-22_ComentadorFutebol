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
import Button from 'react-bootstrap/Button'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import Img from '../images/graphic_model.PNG'
import Img2 from '../images/plus.PNG'

import { useCookies } from 'react-cookie'

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
  console.log("cookies_another_page: " + cookies.logged_user)


  // const createPreset = () => {

  //   const formData = new FormData()
  //   formData.append()

  //   axios.post(url, formData, config).then((response) => {
  //     let game_id = response.data.game_id

  //     document.getElementById('confirmBtn').disabled = false;
  //     setLoading(false)
  //   });
  // }

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
              gender={gender}
              setGender={setGender}
              energy={energy}
              setEnergy={setEnergy}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              bias={team}
              setBias={setTeam}
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

      <div>

        <Container>
          <Row>
            <Col>
              <Link to="/select_game">
                <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '10%', marginLeft: '2%' }} />
              </Link>
            </Col>
            <Col>
              <Title title="FoCo" subtitle="Personality Settings"></Title>
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'right' }}></Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col className="text-center mt-4 mb-4">
              {
                dummyRobots.map(details => {
                  return <Avatar avatar={details} />
                })
              }
            </Col>

            <Col xs={6}><PersonalityDials
              gender={gender}
              setGender={setGender}
              energy={energy}
              setEnergy={setEnergy}
              aggressiveness={aggressiveness}
              setAggressiveness={setAggressiveness}
              bias={team}
              setBias={setTeam}
            /></Col>

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
