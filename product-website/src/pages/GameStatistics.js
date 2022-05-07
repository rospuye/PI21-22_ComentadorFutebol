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

function GameStatistics() {

  const nameA = "Tigers"
  const nameB = "Lions"
  const conditions = ["Goals", "Shots", "Pass"]
  const resultA = [10, 20, 30]
  const resultB = [20, 30, 40]

  const [cookies, setCookie] = useCookies(['logged_user'])

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} style={{ color: 'white', fontSize: '30px', marginTop: '5%', marginLeft: '2%' }} />
            </Link>
          </Col>
          <Col>
            <Title title="FoCo" subtitle="Game Statistics"></Title>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'right' }}>
          </Col>
        </Row>
      </Container>

      <Container>
        {/* <div style={{ marginBottom: "5%" }}>
        <Link to="/">
          <FontAwesomeIcon icon={faHouse} style={{ color: 'white', fontSize: '30px', marginTop: '20px', marginLeft: '20px' }} />
        </Link>
        <Title title="FoCo" subtitle="Game Statistics" />
      </div> */}
        <Row>
          <Col style={{ textAlign: "center" }}>
            <h4>Team Formation</h4>
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
    </>
  )
}

export default GameStatistics