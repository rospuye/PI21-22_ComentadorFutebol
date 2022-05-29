import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import VideoThumbnail from './VideoThumbnail'
import Img from '../images/videoThumbnail.png'
import { Link } from "react-router-dom";

function VideoGrid({ games }) {

    return (
        <>

            {games.map((callbackfn, idx) => (

                <Col key={games[idx].id}>
                    <div style={{ height: '25vh', width: '17vw', marginBottom: '30%' }}>
                        <Link to={"/personality/" + games[idx].id} style={{ textDecoration: 'none' }}>
                            <VideoThumbnail game={games[idx]} img={Img} />
                        </Link>
                    </div>
                </Col>

            ))}
        </>
    )
}

export default VideoGrid