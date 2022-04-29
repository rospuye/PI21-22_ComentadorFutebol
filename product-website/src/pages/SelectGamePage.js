import React from 'react'
import { Container,Row,Col, Button } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'

import '../components/components_css/Form.css';
import VideoGrid from '../components/VideoGrid'


function SelectGamePage() {
  return (
    <>
    <Title title='Commentator' subtitle="Select Your Game" />
    <Container>
        <Row>
            <SortInput/>
        </Row>
        <Row style={{marginTop:'20px'}}>
            <Col xs={3}>
            {/* Filters and Buttons */}
                <SearchBox/>
                <div className='searchBoxDiv'>
                    <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Your Games</Button>
                    <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Upload Your Game</Button>
                    <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Connect to Simulator</Button>
                </div>
            </Col>
            <Col xs={9}>
                <VideoGrid/>
            {/* Grid with videos and pages */}
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default SelectGamePage