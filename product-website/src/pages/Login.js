import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Title from '../components/Title'
import SmallerTitle from '../components/SmallerTitle'

function Login() {
  return (
    <Container>
        <Row>
            <Col style={{padding:"50px"}}>
                <SmallerTitle title="Login"/>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Remember me" />
                    </Form.Group>
                    <div style={{textAlign:"center"}}>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Col>
            <Col style={{padding:"50px"}}>
                <SmallerTitle title="Register"/>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter Username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <div style={{textAlign:"center"}}>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    </Container>
  )
}

export default Login