import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Title from '../components/Title'
import DragDrop from '../components/DragDrop'
import { Alert, Container } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import Img from '../images/upload.jpeg'
import { Button } from 'react-bootstrap'
import '../components/components_css/Form.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Spinner from 'react-bootstrap/Spinner'
import ParticlesBg from 'particles-bg'
import FocoNavbar from '../components/FocoNavbar';

import { useCookies } from 'react-cookie'
import axios from 'axios'
import TTS from '../components/TTS'

function UploadLogPage() {

  const [cookies, setCookie] = useCookies(['logged_user', 'token'])

  const [logFile, setLogFile] = useState(null)
  const [replayFile, setReplayFile] = useState(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [privacy, setPrivacy] = useState("Private")
  const [league, setLeague] = useState("")
  const [year, setYear] = useState("2022")
  const [round, setRound] = useState("")
  const [matchGroup, setMatchGroup] = useState("")

  const [loading, setLoading] = useState(false)

  const [hasReplay, setHasReplay] = useState(true)

  let navigate = useNavigate();

  function validateFormField(field) {
    if ((field.length > 0 && field.length <= 255)) {
      return true
    }
    return false
  }

  function processFile() {
    if (logFile && (replayFile || !hasReplay)) {

      if (validateFormField(title) && validateFormField(league) && validateFormField(round) && validateFormField(matchGroup)) {

        // tts.speak("We are starting the convertion, please wait.", hasButtonClicked) // its necessary to create the initial speak
        const url = process.env.REACT_APP_API_URL + 'file_upload/';
        const formData = new FormData();
        formData.append('logFile', logFile);
        formData.append('replayFile', replayFile)
        // formData.append('user', cookies.logged_user);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('isPublic', privacy);
        formData.append('league', league);
        formData.append('year', year);
        formData.append('round', round);
        formData.append('matchGroup', matchGroup);
        formData.append('has_replay', hasReplay)
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Token ${cookies.token}`
            // 'Access-Control-Allow-Origin': 'http://localhost:3001'
          },
        };

        document.getElementById('confirmBtn').disabled = true;

        setLoading(true)
        axios.post(url, formData, config)
          .then((response) => {
            console.log(response);
            let game_id = response.data.game_id
            navigate('/personality/' + game_id, {state: { game_id: game_id }});
            document.getElementById('confirmBtn').disabled = false;
            setLoading(false)
          })
          .catch(err => {
            alert("Error")
            document.getElementById('confirmBtn').disabled = false;
            setLoading(false)
          })

      }
      else {
        if (!validateFormField(title)) {
          document.getElementById("titleWarning").style.display = 'block';
        }
        else {
          document.getElementById("titleWarning").style.display = 'none';
        }

        if (!validateFormField(league)) {
          document.getElementById("leagueWarning").style.display = 'block';
        }
        else {
          document.getElementById("leagueWarning").style.display = 'none';
        }

        if (!validateFormField(round)) {
          document.getElementById("roundWarning").style.display = 'block';
        }
        else {
          document.getElementById("roundWarning").style.display = 'none';
        }

        if (!validateFormField(matchGroup)) {
          document.getElementById("matchGroupWarning").style.display = 'block';
        }
        else {
          document.getElementById("matchGroupWarning").style.display = 'none';
        }
      }

    }
    else {
      console.log("NO FILE!!!")
    }
  }

  function handleCallback(file, filename) {
    if (file.name.endsWith(".log")) {
      setLogFile(file);
      setTitle(filename);
    }
    else if (file.name.endsWith(".replay")) {
      setReplayFile(file);
    }
  }

  return (
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
              <Title title="FoCo" subtitle="Upload Your Log File"></Title>
            </Col>
          </Row>
        </Container>
        <br/>

        <Container style={{display: "flex", justifyContent: "center"}}>
          <Form.Check
            inline
            label="Upload Replay File"
            name="filetype"
            type="radio"
            checked={hasReplay}
            onChange={() => setHasReplay(true)}
          />
          <Form.Check
            inline
            label="Generate Replay File"
            name="filetype"
            type="radio"
            checked={!hasReplay}
            onChange={() => setHasReplay(false)}
          />          
        </Container>

        {!hasReplay &&
        <Container style={{display: "flex", justifyContent: "center"}}>
          <br/>
          <span 
            variant="warning"
            style={{color: "red"}}
          >Generating a Replay may take some minutes to proccess!</span>
        </Container>
        }
        
        
        
        <Container>
          <Col style={{ marginLeft: '10%', marginRight: '10%' }}>

            <Row className='text-center' style={{ marginTop: '5%', marginBottom: '5%', display: 'flex', justifyContent: 'center' }}>
              <h6 style={{ color: 'white' }}>
                {hasReplay ? 
                <>
                Upload both a log file and a replay file of your game!
                </>
                :
                <>
                Upload a log file of your game!
                </>
                }
                
              </h6>
              <DragDrop parentCallback={handleCallback} />
            </Row>

            {(logFile && (replayFile || !hasReplay)) ?
              <Row style={{ marginBottom: '5%' }}>
                <Col style={{ paddingLeft: '20%', paddingRight: '20%' }}>
                  <Container className='logUpload'>
                    <Form>

                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" defaultValue={logFile.name} onChange={(e) => { setTitle(e.target.value) }} />
                        {/* style={{ display: 'none' }} */}
                        <Form.Text className="text-muted errorMessage" id="titleWarning" style={{ display: 'none' }}>
                          This title is not long enough.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <FloatingLabel label="Comments">
                          <Form.Control
                            as="textarea"
                            placeholder="Enter description"
                            style={{ height: '100px' }}
                            onChange={(e) => { setDescription(e.target.value) }}
                          />
                        </FloatingLabel>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Video Privacy</Form.Label>
                        <FloatingLabel>
                          <Form.Select style={{ paddingTop: '0px', paddingBottom: '0px', height: '40px' }} onChange={(e) => { setPrivacy(e.target.value) }}>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                          </Form.Select>
                        </FloatingLabel>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>League</Form.Label>
                        <Form.Control type="text" placeholder="Enter league" onChange={(e) => { setLeague(e.target.value) }} />
                        <Form.Text className="text-muted errorMessage" id="leagueWarning" style={{ display: 'none' }}>
                          A value for the league is mandatory.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Year</Form.Label>
                        <Form.Control id="game_year" type="number" min="1900" max={new Date().getFullYear()} step="1" defaultValue={new Date().getFullYear()} placeholder="Enter year" onChange={(e) => {
                          if (e.target.value > new Date().getFullYear()) {
                            document.getElementById("game_year").value = new Date().getFullYear();
                          }
                          setYear(e.target.value)
                        }} onBlur={(e) => {
                          if (document.getElementById("game_year").value < 1900) {
                            document.getElementById("game_year").value = 1900;
                            setYear(e.target.value)
                          }
                        }}/>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Round</Form.Label>
                        <Form.Control type="text" placeholder="Enter round" onChange={(e) => { setRound(e.target.value) }} />
                        <Form.Text className="text-muted errorMessage" id="roundWarning" style={{ display: 'none' }}>
                          A value for the round is mandatory.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Match group</Form.Label>
                        <Form.Control type="text" placeholder="Enter match group" onChange={(e) => { setMatchGroup(e.target.value) }} />
                        <Form.Text className="text-muted errorMessage" id="matchGroupWarning" style={{ display: 'none' }}>
                          A value for the match group is mandatory.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group style={{ textAlign: 'center', marginTop: '5%' }}>
                        <Button id='confirmBtn' className='btnUpload' type="button" variant="primary" size="lg" style={{ width: '18%', margin: 'auto' }} onClick={processFile}>
                          {loading ?
                            <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
                            :
                            "Confirm"
                          }
                        </Button>
                      </Form.Group>

                    </Form>
                  </Container>
                </Col>
              </Row>
              :
              <></>}

          </Col>
        </Container>
      </div>
    </>
  )
}

export default UploadLogPage