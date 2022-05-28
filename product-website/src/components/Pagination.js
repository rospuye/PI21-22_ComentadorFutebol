import React from 'react'

// CSS
import '../components/css/style.css'

// import { Container, Row, Col, Button } from 'react-bootstrap'
// import VideoThumbnail from './VideoThumbnail'
// import Img from '../images/videoThumbnail.png'
// import { Link } from "react-router-dom";

function MyPagination({ no_pages }) {

    return (
        <>
            <div class="pagination" style={{ display: "flex", justifyContent: "center" }}>
                <a>&laquo;</a>

                {[
                    ...Array(no_pages),
                ].map((value, idx) => (
                    <a id={"page" + (idx + 1)} key={idx} onClick={() => {  }}>{idx + 1}</a>
                ))}

                {/* <a onClick={() => { setSelectedPage(1); requestGame(); }}>1</a>
                <a class="active" onClick={() => { setSelectedPage(2); requestGame(); }}>2</a>
                <a onClick={() => { setSelectedPage(3); requestGame(); }}>3</a>
                <a onClick={() => { setSelectedPage(4); requestGame(); }}>4</a>
                <a onClick={() => { setSelectedPage(5); requestGame(); }}>5</a>
                <a onClick={() => { setSelectedPage(6); requestGame(); }}>6</a> */}
                <a>&raquo;</a>
            </div>

        </>
    )
}

export default MyPagination