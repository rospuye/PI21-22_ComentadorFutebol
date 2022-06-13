import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import VideoThumbnail from './VideoThumbnail'
import Img from '../images/videoThumbnail.png'
import { Link } from "react-router-dom";

function VideoGrid({ games, isEditable=false }) {

    const url = isEditable ? "/edit_video/" : "/personality/"

    return (
        <>
        {(games.length !== 0) ? 
            games.map((callbackfn, idx) => (

                <Col xs={4} key={games[idx].id}>
                    <div style={{width: '17vw', marginBottom: '10%' }}>
                        <Link to={url + games[idx].id} style={{ textDecoration: 'none' }}>
                            <VideoThumbnail game={games[idx]} img={Img} />
                        </Link>
                    </div>
                </Col>

            ))
        : 
        <Col>
            <div style={{ height: '60%', width: '100%', marginBottom: '30%' }}>
                <h1 className='gridTitle'>No Games To Show</h1>
            </div>
        </Col>
        }
        </>
    )
}

export default VideoGrid