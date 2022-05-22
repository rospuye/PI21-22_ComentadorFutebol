import React, { useState } from 'react'
import Dropdown from 'react-dropdown';
import { Container, Row, Col } from 'react-bootstrap'
import Select from 'react-select'
import 'react-dropdown/style.css';
import './components_css/SortInput.css';
import '../components/components_css/test.css';

function SortInput() {
  const options = [
    'Name ASC', 'Name DESC', 'Date ASC', 'Date DESC'
  ];

  const [selected, setSelected] = useState("Sort");

  const _onSelect = (option) => {
      setSelected(option);
  }

  return (
    <Row style={{display:'flex',alignItems:'center',justifyContent:'right'}}>
      {/* style={{display:'flex',alignItems:'center',justifyContent:'right'}} */}
      <Col xs={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
        <p id='sortP'>Sort By:</p>
      </Col>
      <Col xs={4} style={{display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
        <Dropdown className='inputDropdown' options={options} onChange={_onSelect} value={selected} placeholder="Select an option" />;
      </Col>
    </Row>
  )
}

export default SortInput