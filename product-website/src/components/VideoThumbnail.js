import React from 'react'
import { Container,Row,Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSolid,faPen } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";


function VideoThumbnail({title,Img,date,login}) {
  return (
    <Col style={{paddingLeft:'15%',paddingRight:'15%',paddingBottom:'15%'}}>
        <Row style={{marginBottom:'10px'}}>
        <img
            alt='Field'
            src={Img}
            className='img-thumbnail'
        />
        </Row>
        <Row>
        <Col>
            <Row>
                <p className='thumbnailTitle'>{title}</p>
            </Row>
            <Row>
                <p className='thumbnailDate'>{date}</p>
            </Row>
        </Col>
        <Col style={{display:'flex',justifyContent:'right'}}>
        {login ?
            <Link to="/edit_video">
            <Button style={{height:'70%'}} variant="primary" type="submit" size="lg" className='formBtn'>
                <FontAwesomeIcon icon={faPen}/>
            </Button>
            </Link>
        : <></> }
        </Col>
        </Row>
    </Col>
  )
}

export default VideoThumbnail