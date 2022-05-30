import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Title from '../components/Title'
import Statistics from '../components/Statistics'
import Img from '../images/Field.png'
import Button from 'react-bootstrap/Button'

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie';

import FocoNavbar from '../components/FocoNavbar';
import ParticlesBg from 'particles-bg'

function GameStatistics() {

  const nameA = "Tigers"
  const nameB = "Lions"
  const conditions = ["Goals", "Shots", "Pass"]
  const resultA = [10, 20, 30]
  const resultB = [20, 30, 40]

  const [cookies, setCookie] = useCookies(['logged_user'])

  return (
    <>
    <div className='particlesBG'>
      <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
    </div>
    <div style={{ padding: '1%' }}>
    <Container>
      <FocoNavbar goesBack={true} backPage={'/'} hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
    </Container>
      <Container>
        <Row>
          <Col>
            <Title title="FoCo" subtitle="Game Statistics"></Title>
          </Col>
        </Row>
      </Container>

      <Container style={{marginTop:'5%', marginBottom:'5%'}}>
        <Row>
          <Col style={{ textAlign: "center" }}>
            <h4 style={{marginBottom:'2%'}} className="statisticsH4">Team Formation</h4>
            <img
              alt='Field'
              src={Img}
              className='img-thumbnail'
            />
          </Col>
          <Col>
            <Statistics nameOfTeamA={nameA} nameOfTeamB={nameB} conditions={conditions} resultsA={resultA} resultsB={resultB} />
          </Col>
        </Row>
      </Container>
      </div>
    </>
  )
}

export default GameStatistics