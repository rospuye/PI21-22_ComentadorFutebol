import React from 'react'
import { useCookies } from 'react-cookie'
import Title from '../components/Title'
import { Container } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

function EditVideoPage() {
  const [cookies, setCookie] = useCookies(['logged_user'])
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
            <Title title="Commentator" subtitle="Edit Your Video"></Title>
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
        <Row>
          <Col xs={3} />
          <Col xs={6}>
            <Row>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter title" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <FloatingLabel label="Comments">
                    <Form.Control
                      as="textarea"
                      placeholder="Enter Description"
                      style={{ height: '100px' }}
                    />
                  </FloatingLabel>
                </Form.Group>


                <Form.Group>
                  <Form.Label>Video Privacy</Form.Label>
                  <FloatingLabel>
                    <Form.Select style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                      <option>Choose the privacy</option>
                      <option value="1">Public</option>
                      <option value="2">Private</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>

              </Form>
            </Row>
            <Row style={{ marginTop: '5%' }}>
              <Col style={{ textAlign: 'center' }}>
                <Button variant="success" type="submit">
                  Save
                </Button>
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Button variant="danger" type="submit">
                  Delete Video
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={3} />
        </Row>
      </Container>


    </>
  )
}

export default EditVideoPage