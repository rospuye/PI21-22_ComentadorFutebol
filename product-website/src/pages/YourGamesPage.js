import React,{ useState } from 'react'
import { Container,Row,Col, Button } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'

import '../components/components_css/Form.css';
import VideoGrid from '../components/VideoGrid'

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

function YourGamesPage() {
  return (
    <>
    <Link to="/select_game">
        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
    </Link>
    <Title title='Commentator' subtitle="Your Games" />
    <Container>
        <Row>
            <SortInput/>
        </Row>
        <Row style={{marginTop:'20px'}}>
            <Col xs={3}>
            {/* Filters and Buttons */}
                <SearchBox login={true}/>
            </Col>
            <Col xs={9}>
                <VideoGrid login={true}/>
            {/* Grid with videos and pages */}
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default YourGamesPage