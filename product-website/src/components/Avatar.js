import React from 'react';
import './components_css/Title.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Row from 'react-bootstrap/Row'

function Avatar(props) {
    let img_key;
    for(var key in props.avatar.src) {
        img_key = props.avatar.src[key];
    }

    return (
        <Row>
            <div style={{ width: '100%' }}>
                <img
                    alt={props.avatar.alt}
                    src={img_key}
                    className='img-thumbnail'
                    style={{ maxWidth: '8rem', marginBottom: '3%' }}
                />
            </div>
        </Row>
    )
}

export default Avatar;