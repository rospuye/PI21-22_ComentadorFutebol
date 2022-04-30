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


function SelectGamePage() {

    const [login, setLogin] = useState(true);


  return (
    <>
    <Link to="/">
        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white', fontSize: '30px', marginTop: '2%', marginLeft: '2%' }} />
    </Link>
    <Title title='Commentator' subtitle="Select Your Game" />
    <Container>
        <Row>
            <SortInput/>
        </Row>
        <Row style={{marginTop:'20px'}}>
            <Col xs={3}>
            {/* Filters and Buttons */}
                <SearchBox login={login}/>
                {login ? 
                    <div className='searchBoxDiv'>
                        <Link to="/your_games">
                            <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Your Games</Button>
                        </Link>
                        <Link to="/upload">
                            <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Upload Your Game</Button>
                        </Link>
                        <Link to="/simulator">
                            <Button variant="primary" type="submit" size="lg" className='formBtn searchBoxDivInput'>Connect to Simulator</Button>
                        </Link>
                    </div> 
                : <></>}
            </Col>
            <Col xs={9}>
                <VideoGrid login={false}/>
            {/* Grid with videos and pages */}
            </Col>
        </Row>
    </Container>
    </>
  )
}

export default SelectGamePage