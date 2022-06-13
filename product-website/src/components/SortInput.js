import React, { useState } from 'react'
import Dropdown from 'react-dropdown';
import { Container, Row, Col } from 'react-bootstrap'
// import Select from 'react-select'
import 'react-dropdown/style.css';
import './components_css/SortInput.css';
import '../components/components_css/test.css';

function SortInput({sort, setSort}) {
  const options = [
    'Title', 'Year', 'League', 'Round', 'Match_Group'
  ];


  const _onSelect = (option) => {
      setSort(option.value);
  }

  return (
    <Row style={{display:'flex',alignItems:'center',justifyContent:'right'}}>
      {/* style={{display:'flex',alignItems:'center',justifyContent:'right'}} */}
      <Col xs={6} style={{alignItems:'center',justifyContent:'right',marginBottom:'3%',justifyContent:'right',paddingLeft:'0%!important',paddingRight:'0%!important'}}>
        <p id='sortP'>Sort By:</p>
      </Col>
      <Col xs={4} style={{alignItems:'center',justifyContent:'right',marginBottom:'3%',justifyContent:'right',paddingLeft:'0%!important',paddingRight:'0%!important',paddingTop:'4%'}}>
        <Dropdown 
          className='inputDropdown' 
          options={options} 
          onChange={_onSelect} 
          value={sort} 
          placeholder="-----" />;
      </Col>
    </Row>
  )
}

export default SortInput