import React from 'react';
import './components_css/Title.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function Avatar({avatar, src, setGender, setEnergy, setAggressiveness, 
    setTeam}) {

    const handleClick = () => {
        setGender(avatar.gender)
        setEnergy(avatar.energetic_val)
        setAggressiveness(avatar.aggressive_val)
        setTeam(avatar.bias)
    }

    return (
            <Col xs={6} onClick={handleClick} style={{textAlign:'center',marginBottom:'5%',marginTop:'5%'}}>
                <img
                    alt={avatar.name}
                    src={src}
                    className='img-thumbnail'
                    style={{ maxWidth: '8rem', marginBottom: '3%' }}
                />
                <p style={{color: "white",textAlign:'center'}}>{avatar.name}</p>
            </Col>
    )
}

export default Avatar;