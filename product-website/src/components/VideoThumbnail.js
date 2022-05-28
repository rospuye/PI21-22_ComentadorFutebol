import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSolid, faPen } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


function VideoThumbnail({ game, img }) {

    return (
        
            <Col style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                <Row style={{ marginBottom: '10px' }}>
                    <img
                        alt='Field'
                        src={img}
                        className='img-thumbnail'
                    />
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <p className='thumbnailTitle'>{game.title}</p>
                        </Row>
                        <Row>
                            <p className='thumbnailDate'>
                                <strong>League: </strong>{game.league}<br/>
                                <strong>Match group: </strong>{game.match_group}<br/>
                                <strong>Round: </strong>{game.round}<br/>
                            </p>
                        </Row>
                    </Col>
                    <Col style={{ display: 'flex', justifyContent: 'right' }}>
                        {/* {login ?
            <Link to="/edit_video">
            <Button style={{height:'65%',width:'70%'}} variant="primary" type="submit" size="lg" className='formBtn'>
                <FontAwesomeIcon icon={faPen}/>
            </Button>
            </Link>
        : <></> } */}
                    </Col>
                </Row>
            </Col>
    )
}

export default VideoThumbnail