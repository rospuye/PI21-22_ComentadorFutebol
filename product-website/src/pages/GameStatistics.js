import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Title from '../components/Title'
import Statistics from '../components/Statistics'
import Button from 'react-bootstrap/Button'

import {Spinner} from 'react-bootstrap'

import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie';

import FocoNavbar from '../components/FocoNavbar';
import ParticlesBg from 'particles-bg'

import axios from "axios"
import GameFormation from '../components/GameFormation'

function GameStatistics() {

  const nameA = "Tigers"
  const nameB = "Lions"
  const resultA = [10, 20, 30]
  const resultB = [20, 30, 40]

  const [cookies, setCookie] = useCookies(['logged_user'])

  const [game, setGame] = useState({})

  let {id} = useParams()

  console.log("sussy ID", id)

  const getGameById = () => {
    const url = process.env.REACT_APP_API_URL + 'games/' + id;

    let config = {}
    if (cookies.token != null && cookies.token !== "") {
      config = {
        headers: {
          'content-type': 'multipart/form-data',
          'Authorization': `Token ${cookies.token}`
        }
      }
    }
    else {
      config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    }

    axios.get(url, config).then((response) => {
        console.log("statistics response", response)
        // setUserPresets(response.data)
        setGame(response.data)
    });
  
  }

  useEffect(() => {
    getGameById()
  }, [])

  return (
    <>
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

            {Object.keys(game).length === 0 ?
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10em"}}>
                <Spinner animation={"border"} variant={"primary"} />
              </div>
            :

              <Container style={{marginTop:'5%', marginBottom:'5%'}}>
                <Row>
                  <Col style={{ textAlign: "center" }}>
                    <h4 style={{marginBottom:'2%'}} className="statisticsH4">Team Formation</h4>
                    <GameFormation
                      formationA={game.processed_data.form[0]}
                      formationB={game.processed_data.form[1]}
                    />
                  </Col>
                  <Col>
                    <Statistics 
                      nameOfTeamA={game.processed_data.teams[0]} 
                      nameOfTeamB={game.processed_data.teams[1]} 
                      stats={game.processed_data.stats} />
                  </Col>
                </Row>
              </Container>
            }

          </div>
        </>
    </>
  )
}

export default GameStatistics