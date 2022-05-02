import React, { useState } from 'react'
import Dropdown from 'react-dropdown';
import { Container,Row,Col } from 'react-bootstrap'
import 'react-dropdown/style.css';
import './components_css/SortInput.css';

function SortInput() {
    const options = [
        'Name ASC','Name DESC','Date ASC','Date DESC'
      ];
      const [selected, setSelected] = useState("Select Option");

    const _onSelect = (option) => {
          setSelected(option);
      }

  return (
    <div>
        <Row>
        <Col xs={9} style={{display:'flex',alignItems:'center',justifyContent:'right'}}>
            <p id='sortP'>Sort By:</p>
        </Col>
        <Col xs={2} >
            <Dropdown className='inputDropdown' options={options} onChange={_onSelect} value={selected} placeholder="Select an option" />;
        </Col>
        </Row>
    </div>
  )
}

export default SortInput