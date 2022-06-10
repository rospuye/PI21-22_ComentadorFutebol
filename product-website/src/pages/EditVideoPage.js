import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import Title from '../components/Title'
import { Container, Spinner } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import FocoNavbar from '../components/FocoNavbar';
import ParticlesBg from 'particles-bg'
import axios from 'axios'

function EditVideoPage() {
    const [cookies, setCookie] = useCookies(['logged_user', 'token'])

    const [isLoaded, setIsLoaded] = useState(false)

    // Game attributes
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    // const [isPublic, setIsPublic] = useState(false)
    const [privacy, setPrivacy] = useState("Private")
    const [league, setLeague] = useState("")
    const [year, setYear] = useState(1900)
    const [round, setRound] = useState("")
    const [matchGroup, setMatchGroup] = useState("")

    let { id } = useParams();

    const navigate = useNavigate()

    let config = {}
    config = {
        headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Token ${cookies.token}`
        }
    }

    let url = `${process.env.REACT_APP_API_URL}games/${id}/`


    const makeUpdate = () => {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("is_public", privacy === "Public")
        formData.append("league", league)
        formData.append("year", year)
        formData.append("round", round)
        formData.append("match_group", matchGroup)

        console.log("formdata", formData)

        axios.patch(url, formData, config)
            .then(response => {
                console.log("response", response)
                navigate("/your_games/")
            })
            
    }

    const requestGame = () => {
        axios.get(url, config)
            .then(res => {
                let game = res.data
                setTitle(game.title)
                setDescription(game.description)
                setPrivacy(game.is_public ? "Public" : "Private")
                setLeague(game.league)
                setYear(game.year)
                setRound(game.round)
                setMatchGroup(game.match_group)
                setIsLoaded(true)
            })
    }

    useEffect(() => {
        requestGame()
    }, [])

  return (
    <>
    <div className='particlesBG'>
        <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
    </div>
    <div style={{ padding: '1%' }}>
        <Container>
            <FocoNavbar goesBack={true} backPage={'/select_game'} hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
        </Container>
        <Container style={{marginBottom:'2%'}}>
            <Row>
                <Col>
                    <Title title="Commentator" subtitle="Edit Your Video"></Title>
                </Col>
            </Row>
        </Container>

        {
            isLoaded ?
                <Container style={{marginBottom:'5%'}}>
                    <Row>
                    <Col xs={3} />
                    <Col xs={6}>
                        <Container className = "logUpload">
                        <Row>
                        <Col  style={{backgroundColor:"#212428"}}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter title" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <FloatingLabel label="Comments">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter Description"
                                        style={{ height: '100px' }}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FloatingLabel>
                            </Form.Group>


                            <Form.Group className="mb-3">
                            <Form.Label>Video Privacy</Form.Label>
                            <FloatingLabel>
                                <Form.Select 
                                    style={{ paddingTop: '0px', paddingBottom: '0px' }} 
                                    onChange={(e) => setPrivacy(e.target.value)}
                                    value={privacy}
                                >
                                    <option value="Public">Public</option>
                                    <option value="Private">Private</option>
                                </Form.Select>
                            </FloatingLabel>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>League</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter league" 
                                    value={league}
                                    onChange={(e) => setLeague(e.target.value)}
                                    
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Year</Form.Label>
                                <Form.Control 
                                    id="game_year"
                                    type="number"
                                    min="1900" 
                                    placeholder="Enter year" 

                                    value={year}

                                    onChange={(e) => {
                                        if (e.target.value > new Date().getFullYear()) {
                                          document.getElementById("game_year").value = new Date().getFullYear();
                                        }
                                        setYear(e.target.value)
                                      }} 
                                    onBlur={(e) => {
                                        if (document.getElementById("game_year").value < 1900) {
                                          document.getElementById("game_year").value = 1900;
                                          setYear(e.target.value)
                                        }
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Round</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter round" 
                                    value={round}
                                    onChange={(e) => setRound(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Match Group</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter match group" 
                                    value={matchGroup}
                                    onChange={(e) => setMatchGroup(e.target.value)}
                                />
                            </Form.Group>

                        </Form>
                        </Col>
                        </Row>
                        <Row style={{ marginTop: '5%' , marginBottom:'3%'}}>
                        <Col style={{ textAlign: 'center' }}>
                            <Button 
                                className="editVideoButtonSave"
                                variant="success" 
                                type="submit"
                                onClick={() => makeUpdate()}
                            >
                            Save
                            </Button>
                        </Col>
                        <Col style={{ textAlign: 'center' }}>
                            <Button className="editVideoButtonCancel"variant="danger" type="submit">
                            Delete Video
                            </Button>
                        </Col>
                        </Row>
                        </Container>
                    </Col>
                    <Col xs={3} />
                    </Row>
                </Container>
            :
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10em"}}>
                    <Spinner animation={"border"} variant={"primary"} />
                </div>
        }

        

    </div>
    </>
  )
}

export default EditVideoPage