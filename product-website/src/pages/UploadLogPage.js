import React, { useState, useRef } from 'react'
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
import axios from 'axios'

function UploadLogPage() {

  const [cookies, setCookie] = useCookies(['logged_user'])
  const inputFile = useRef(null)

  const [file, setFile] = useState(null)

  function processFile(file) {
    if (file) {

      console.log(file)
      
      const url = 'http://127.0.0.1:8000/file_upload/';
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      axios.post(url, formData, config).then((response) => {
        console.log(response.data);
      });
      
    }
  }

  const onButtonClick = () => {
    inputFile.current.click()
  }

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
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={(event) => {
              setFile(event.target.files[0])
              document.getElementById('confirmBtn').disabled = false
            }} />
            <Button variant="primary" type="submit" size="lg" style={{ width: '18%', margin: 'auto' }} className="formBtn" onClick={onButtonClick}>
              Load
            </Button>
            <Button id='confirmBtn' variant="primary" type="submit" size="lg" style={{ width: '18%', margin: 'auto' }} className="formBtn" onClick={processFile(file)} disabled>
              Confirm
            </Button>
          </Row>
        </Col>
      </Container>
    </>
  )
}

export default UploadLogPage