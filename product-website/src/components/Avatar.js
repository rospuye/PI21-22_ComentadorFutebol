import React from 'react';
import './components_css/Title.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Row from 'react-bootstrap/Row'

function Avatar({avatar, src, setGender, setEnergy, setAggressiveness, 
    setTeam}) {

    const handleClick = () => {
        setGender(avatar.gender)
        setEnergy(avatar.energetic_val)
        setAggressiveness(avatar.aggressive_val)
        setTeam(avatar.bias)
    }

    return (
        <Row>
            <div style={{ width: '100%' }} onClick={handleClick}>
                <p style={{color: "white"}}>{avatar.name}</p>
                <img
                    alt={avatar.name}
                    src={src}
                    className='img-thumbnail'
                    style={{ maxWidth: '8rem', marginBottom: '3%' }}
                />
            </div>
        </Row>
    )
}

export default Avatar;