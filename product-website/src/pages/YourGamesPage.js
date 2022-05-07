import React, { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import SearchBox from '../components/SearchBox'
import SortInput from '../components/SortInput'
import Title from '../components/Title'

import '../components/components_css/Form.css';
import VideoGrid from '../components/VideoGrid'

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useCookies } from 'react-cookie'

function YourGamesPage() {

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
                        <Title title="FoCo" subtitle="Your Games"></Title>
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
                    <SortInput />
                </Row>
                <Row style={{ marginTop: '20px' }}>
                    <Col xs={3}>
                        {/* Filters and Buttons */}
                        <SearchBox login={true} />
                    </Col>
                    <Col xs={9}>
                        <VideoGrid login={true} yourGames={true}/>
                        {/* Grid with videos and pages */}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default YourGamesPage