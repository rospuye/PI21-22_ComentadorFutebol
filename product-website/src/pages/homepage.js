// React
import React, { Component } from 'react';
import { Link } from "react-router-dom";

// Components
import Title from '../components/Title';

// Bootstrap
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

// Fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

import Img from '../images/graphic_model.PNG'

class Homepage extends Component {
  render() {
    let intro = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquam consequat nisi quis maximus. Morbi commodo eget justo a lacinia. Fusce euismod aliquet ornare. Aenean laoreet sem a neque lacinia iaculis. Suspendisse potenti. Mauris eu magna augue. Duis ac sapien eu lorem viverra eleifend cursus vitae purus.";
    return (<div style={{ padding: '1%' }}>

      <Container>
        <Row>
          <Col></Col>
          <Col></Col>
          <Col xs lg="2">
            <Button variant="light">Login/Register</Button>
          </Col>
        </Row>
      </Container>

      <Title subtitle={intro}></Title>

      <Container>
        <Row>
          <Col>
            <div style={{ width: '100%', 'paddingLeft': '10%', paddingTop: '5%' }}>
              <img
                src={Img}
                className='img-thumbnail'
                style={{ maxWidth: '24rem', marginLeft: '10%', marginTop: '2%' }}
              />
            </div>
          </Col>
          <Col>
            <div style={{ width: '100%', paddingLeft: '25%', paddingTop: '20%' }}>
              <Link to="/another_page">
                <Button variant="success" size="lg">Start <FontAwesomeIcon icon={faPlay} /></Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

    </div>);
  }
}

export default Homepage;