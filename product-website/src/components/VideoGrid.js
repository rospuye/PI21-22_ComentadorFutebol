import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import VideoThumbnail from './VideoThumbnail'
import Img from '../images/videoThumbnail.png'
import { Link } from "react-router-dom";

function VideoGrid({ login, yourGames }) {
    return (
        <>
        {yourGames ?
        <>
            <Row>
            <Col>
                    <VideoThumbnail login={login} Img={Img} title={"Video 1"} date={"22/03/2022"} />
            </Col>
            <Col>
                    <VideoThumbnail login={login} Img={Img} title={"Video 2"} date={"22/03/2022"} />
            </Col>
            <Col>
                    <VideoThumbnail login={login} Img={Img} title={"Video 3"} date={"21/03/2022"} />
            </Col>
        </Row>
        <Row>
            <Col>
                    <VideoThumbnail login={login} Img={Img} title={"Video 4"} date={"21/03/2022"} />
            </Col>
            <Col>
                    <VideoThumbnail login={login} Img={Img} title={"Video 5"} date={"20/03/2022"} />
            </Col>
            <Col>
                    <VideoThumbnail login={login} Img={Img} title={"Video 6"} date={"20/03/2022"} />
            </Col>
        </Row>
        </>
        :
        <>
            <Row>
                <Col>
                    <Link to="/personality" style={{ textDecoration: 'none' }}>
                        <VideoThumbnail login={login} Img={Img} title={"Video 1"} date={"22/03/2022"} />
                    </Link>
                </Col>
                <Col>
                    <Link to="/personality" style={{ textDecoration: 'none' }}>
                        <VideoThumbnail login={login} Img={Img} title={"Video 2"} date={"22/03/2022"} />
                    </Link>
                </Col>
                <Col>
                    <Link to="/personality" style={{ textDecoration: 'none' }}>
                        <VideoThumbnail login={login} Img={Img} title={"Video 3"} date={"21/03/2022"} />
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/personality" style={{ textDecoration: 'none' }}>
                        <VideoThumbnail login={login} Img={Img} title={"Video 4"} date={"21/03/2022"} />
                    </Link>
                </Col>
                <Col>
                    <Link to="/personality" style={{ textDecoration: 'none' }}>
                        <VideoThumbnail login={login} Img={Img} title={"Video 5"} date={"20/03/2022"} />
                    </Link>
                </Col>
                <Col>
                    <Link to="/personality" style={{ textDecoration: 'none' }}>
                        <VideoThumbnail login={login} Img={Img} title={"Video 6"} date={"20/03/2022"} />
                    </Link>
                </Col>
            </Row>
            </>
        }
        </>
    )
}

export default VideoGrid