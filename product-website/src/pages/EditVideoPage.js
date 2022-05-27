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

import FocoNavbar from '../components/FocoNavbar';
import ParticlesBg from 'particles-bg'

function EditVideoPage() {
  const [cookies, setCookie] = useCookies(['logged_user'])
  return (
    <>
    <div className='particlesBG'>
      <ParticlesBg className="particles-bg-canvas-self" type="cobweb" bg={true} color="#DADADA" height={'100%'}/>
    </div>
    <div style={{ padding: '1%' }}>
    <Container>
      <FocoNavbar goesBack={true} backPage={'/select_game'} hasLoginBtn={true} cookies={cookies} setCookie={setCookie}/>
    </Container>
      <Container>
        <Row>
          <Col>
            <Title title="Commentator" subtitle="Edit Your Video"></Title>
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
                <Button className="editVideoButtonSave"variant="success" type="submit">
                  Save
                </Button>
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Button className="editVideoButtonCancel"variant="danger" type="submit">
                  Delete Video
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs={3} />
        </Row>
      </Container>

    </div>
    </>
  )
}

export default EditVideoPage