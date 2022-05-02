import React, { useRef } from 'react'
import Title from '../components/Title'
import { Container } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import Img from '../images/upload.jpeg'
import { Button } from 'react-bootstrap'
import '../components/components_css/Form.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie'

function UploadLogPage() {

  const [cookies, setCookie] = useCookies(['logged_user'])
  const inputFile = useRef(null)

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  return (
    <>

      <Container>
        <Row>
          <Col>
            <Link to="/select_game">
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '10%', marginLeft: '2%' }} />
            </Link>
          </Col>
          <Col>
            <Title title="Commentator" subtitle="Upload Your Log File"></Title>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'right' }}>
            {cookies.logged_user !== '' ?
              <Button variant="light" style={{ height: '40px', marginTop: '5%' }} onClick={() => {
                setCookie('logged_user', '', { path: '/' })
                window.location.href = '../select_game'
              }}>Logout</Button>
              :
              <></>
            }
          </Col>
        </Row>
      </Container>

      <Container>
        <Col style={{ marginLeft: '10%', marginRight: '10%' }}>
          <Row style={{ marginTop: '5%', marginBottom: '5%', display: 'flex', justifyContent: 'center' }}>
            <img
              alt='Field'
              src={Img}
              className='img-thumbnail'
              style={{ height: '400px', width: '700px' }}
            />
          </Row>
          <Row style={{ marginBottom: '10%', textAlign: 'center' }}>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} />
            <Link to="/game_viewing">
              <Button variant="primary" type="submit" size="lg" style={{ width: '18%', margin: 'auto' }} className="formBtn" onClick={onButtonClick}>
                Load
              </Button>
            </Link>
          </Row>
        </Col>
      </Container>
    </>
  )
}

export default UploadLogPage